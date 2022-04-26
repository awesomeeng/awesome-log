// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("Writer LogLevels",()=>{
	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("levels",async function(){
		const TestWriter = require('./writers/TestWriter');
		const Log = require("../src/AwesomeLog");

		Log.init({
			writers: [{
				name: "test",
				type: "test-writer",
				levels: "access,info,error",
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			separate: false,
			buffering: false,
		});

		await Log.start();

		Log.access("This is a ACCESS test.");
		Log.error("This is a ERROR test.");
		Log.warn("This is a WARN test.");
		Log.info("This is a INFO test.");
		Log.debug("This is a DEBUG test.");


		assert(TestWriter.written.length===3);

		await Log.stop();
	});
});
