// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("Error Cause Support",()=>{
	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("JS Formatter",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js"
		});

		await Log.start();

		const err = new Error('this is an error.');
		err.cause = new Error('First nested cause');
		err.cause.cause = new Error('Second nested cause');

		Log.error(err);

		assert(Log.history.length===1);
		assert(Log.history[0].level==='ERROR');
		assert(Log.history[0].text==='this is an error.');
		assert(Log.history[0].args.length===1);
		assert(Log.history[0].args[0] instanceof Error);
		assert(Log.history[0].args[0].cause instanceof Error);
		assert(Log.history[0].args[0].cause.cause instanceof Error);

		await Log.stop();
	});

	it("JSON Formatter",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "json"
		});

		await Log.start();

		const err = new Error('this is an error.');
		err.cause = new Error('First nested cause');
		err.cause.cause = new Error('Second nested cause');

		Log.error(err);

		assert(Log.history.length===1);

		const json = Log.history[0];
		const obj = JSON.parse(json);

		assert(obj.level==='ERROR');
		assert(obj.text==='this is an error.');
		assert(obj.args.length===1);
		assert(obj.args[0].__TYPE==='error');
		assert(obj.args[0].stack);
		assert(obj.args[0].cause.__TYPE==='error');
		assert(obj.args[0].cause.stack);
		assert(obj.args[0].cause.cause.__TYPE==='error');
		assert(obj.args[0].cause.cause.stack);

		await Log.stop();
	});

	it("Default Formatter",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "default",
			historyFormatterOptions: {
				oneline: false,
			}
		});

		await Log.start();

		const err = new Error('this is an error.');
		err.cause = new Error('First nested cause');
		err.cause.cause = new Error('Second nested cause');

		Log.error(err);

		assert(Log.history.length===1);

		const causes = Log.history[0].split("Caused by:");
		assert(causes.length===3);

		await Log.stop();
	});
});
