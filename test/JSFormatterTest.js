// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("JSFormatter",()=>{
	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("js formatter",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			history: true,
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js"
		});
		await Log.start();

		Log.info("Testing formatting...");

		assert.equal(Log.history.length,1);
		assert(Log.history[0]);
		assert(Log.history[0].timestamp);
		assert(Log.history[0].pid);
		assert.equal(Log.history[0].level,"INFO");
		assert(Log.history[0].system);
		assert.equal(Log.history[0].text,"Testing formatting...");
		assert.deepStrictEqual(Log.history[0].args,[]);

		await Log.stop();
	});
});
