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

		assert.equal(Log.history.length,1);
		assert(Log.history[0]);

		const entry = JSON.parse(Log.history[0]);
		assert(entry);
		assert(entry.timestamp);
		assert(entry.pid);
		assert.equal(entry.level,"INFO");
		assert(entry.system);
		assert.equal(entry.text,"Testing formatting...");
		assert.deepStrictEqual(entry.args,[]);

		await Log.stop();
	});
});
