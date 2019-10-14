// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("AbstractLogFormatter",()=>{
	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("default formatter",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			history: true,
			buffering: false,
			disableLoggingNotices: true,
		});
		await Log.start();

		Log.info("Testing formatting...");

		assert.equal(Log.history.length,1);
		assert(Log.history[0].match(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ\s:\s#\d{1,5}\s+:\sINFO\s+:\s[\w\d.-_]+\s+:\sTesting\sformatting\.\.\./));

		await Log.stop();
	});

	it("default formatter arguments",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			history: true,
			disableLoggingNotices: true,
		});
		await Log.start();

		Log.info("Testing argument formatting...",null);
		assert.equal(Log.history.length,1);
		assert(Log.history[0].endsWith("| null"));
		Log.clearHistory();

		Log.info("Testing argument formatting...",true);
		assert.equal(Log.history.length,1);
		assert(Log.history[0].endsWith("| true"));
		Log.clearHistory();

		Log.info("Testing argument formatting...",false);
		assert.equal(Log.history.length,1);
		assert(Log.history[0].endsWith("| false"));
		Log.clearHistory();

		Log.info("Testing argument formatting...",123);
		assert.equal(Log.history.length,1);
		assert(Log.history[0].endsWith("| 123"));
		Log.clearHistory();

		Log.info("Testing argument formatting...","abc");
		assert.equal(Log.history.length,1);
		assert(Log.history[0].endsWith("| abc"));
		Log.clearHistory();

		Log.info("Testing argument formatting...",[1,"2","three"]);
		Log.clearHistory();

		Log.info("Testing argument formatting...",{one:1,two:"2",three:"three"});
		Log.clearHistory();

		Log.info("Testing argument formatting...",new Error("test error."));
		Log.clearHistory();

		await Log.stop();
	});
});
