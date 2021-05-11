// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("CVSFormatter",()=>{
	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("csv formatter",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			history: true,
			buffering: false,
			historyFormatter: "csv"
		});

		await Log.start();

		Log.info("Testing formatting...");
		Log.info("Testing formatting...",123);
		Log.info("Testing formatting...",123,"abc");
		Log.info("Testing formatting...",123,"abc",[456,"def"]);

		assert.strictEqual(Log.history.length,4);
		assert(Log.history[0].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting..."$/));
		assert(Log.history[1].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting...",123$/));
		assert(Log.history[2].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting...",123,"abc"$/));
		assert(Log.history[3].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting...",123,"abc","\[456,\\"def\\"\]"$/));

		await Log.stop();
	});
});
