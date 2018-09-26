// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

const Log = require("../src/AwesomeLog");

describe("AbstractLogFormatter",()=>{
	it("js formatter",function(){
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js"
		});
		Log.start();

		Log.info("Testing formatting...");
		assert(Log.history[0]);
		assert(Log.history[0].timestamp);
		assert(Log.history[0].pid);
		assert.equal(Log.history[0].level,"INFO");
		assert(Log.history[0].system);
		assert.equal(Log.history[0].message,"Testing formatting...");
		assert.deepStrictEqual(Log.history[0].args,[]);

		Log.stop();
	});
});
