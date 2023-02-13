// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("JSONFormatter",()=>{
	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("json formatter",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			history: true,
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "json"
		});
		await Log.start();

		Log.info("Testing formatting...");

		assert.strictEqual(Log.history.length,1);
		assert(Log.history[0]);

		const entry = JSON.parse(Log.history[0]);
		assert(entry);
		assert(entry.timestamp);
		assert(entry.pid);
		assert.strictEqual(entry.level,"INFO");
		assert(entry.system);
		assert.strictEqual(entry.text,"Testing formatting...");
		assert.deepStrictEqual(entry.args,[]);

		await Log.stop();
	});
	
	it("json formatter options - oneline",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			history: true,
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "json",
			historyFormatterOptions: {
				oneline: true
			}
		});
		await Log.start();

		Log.info("Testing formatting...", 1,"2",[3]);

		assert.strictEqual(Log.history.length,1);

		const entry = JSON.parse(Log.history[0]);
		assert.strictEqual(entry.text,"Testing formatting... : [ 1 | 2 | [3] ]");
		assert.deepStrictEqual(entry.args,[1,"2",[3]]);

		await Log.stop();
	});
	
	it("json formatter options - alias/move",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			history: true,
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "json",
			historyFormatterOptions: {
				alias: {
					severity: "level"
				},
				move: {
					message: "text"
				}
			}
		});
		await Log.start();

		Log.info("Testing formatting...");

		assert.strictEqual(Log.history.length,1);

		const entry = JSON.parse(Log.history[0]);
		assert.strictEqual(entry.level,"INFO");
		assert.strictEqual(entry.severity,"INFO");
		assert.strictEqual(entry.text,undefined);
		assert.strictEqual(entry.message,"Testing formatting...");

		await Log.stop();
	});
	
	it("json formatter options - JSON Circular reference catcher enabled",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			history: true,
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "json",
			historyFormatterOptions: {
				alias: {
					severity: "level"
				},
				move: {
					message: "text"
				}
			},
		});
		await Log.start();

		const testObjPlain = { one: 1, two: 2, three: 3 };
		const testObjCircular = { one: 1, two: 2, three: 3 };
		testObjCircular.circular = testObjCircular;

		Log.info("Testing formatting...",testObjPlain);
		Log.info("Testing formatting...",testObjCircular);

		assert.strictEqual(Log.history.length,2);
		assert(Log.history[0].includes('"args":[{"one":1,"two":2,"three":3}]'));
		assert(Log.history[1].includes('"args":["<JSON Parse Error: An error parsing this object into JSON occurred and AwesomeLog has removed it>"]'));		

		await Log.stop();
	});

	it("json formatter options - JSON Circular reference catcher disabled",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			history: true,
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "json",
			historyFormatterOptions: {
				alias: {
					severity: "level"
				},
				move: {
					message: "text"
				},
				allowCircularReferenceErrors: false,
			}
		});
		await Log.start();

		const testObjCircular = { one: 1, two: 2, three: 3 };
		testObjCircular.circular = testObjCircular;

		assert.throws(()=>{
			Log.info("Testing formatting...",testObjCircular);			
		});
		
		await Log.stop();
	});	
});
