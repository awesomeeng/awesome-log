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
});
