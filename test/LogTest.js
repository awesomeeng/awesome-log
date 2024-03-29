// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("AwesomeLog",()=>{
	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("initialize",()=>{
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js"
		});

		assert(Log.initialized);
	});

	it("start",async ()=>{
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js"
		});

		assert(!Log.running);
		await Log.start();
		assert(Log.running);
		await Log.stop();
	});

	it("stop",async ()=>{
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js"
		});

		assert(!Log.running);
		await Log.start();
		assert(Log.running);
		await Log.stop();
		assert(!Log.running);
	});

	it("log",async ()=>{
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js"
		});

		await Log.start();

		Log.log("ACCESS","This is a ACCESS test.");
		Log.log("ERROR","This is a ERROR test.");
		Log.log("WARN","This is a WARN test.");
		Log.log("INFO","This is a INFO test.");
		Log.log("DEBUG","This is a DEBUG test.");
		assert(Log.history.length===5);

		Log.log("ACCESS","This is a ACCESS test.");
		Log.log("ERROR","This is a ERROR test.");
		Log.log("WARN","This is a WARN test.");
		Log.log("INFO","This is a INFO test.");
		Log.log("DEBUG","This is a DEBUG test.");
		assert(Log.history.length===10);

		try {
			Log.log("","This is an empty string test and it should throw.");
			assert(Log.history.length===11);			
		} catch (error) {
			assert(Log.history.length===10);
		}

		await Log.stop();
		await Log.start();

		assert(Log.history.length===0);
		Log.log("access","The quick brown fox jumped over the lazy dog.");
		assert.strictEqual(Log.history.length,1);
		assert(Log.history[0].pid>0);
		assert(Log.history[0].timestamp>0);
		assert.strictEqual(Log.history[0].level,"ACCESS");
		assert(Log.history[0].system);
		assert.strictEqual(Log.history[0].text,"The quick brown fox jumped over the lazy dog.");
		assert(Log.history[0].args.length<1);

		await Log.stop();
	});
	
	it("Log without message",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js"
		});

		await Log.start();
		
		Log.debug('');
		Log.debug(0);
		Log.debug(false);
		Log.debug(null);
		Log.debug(undefined);
		assert(Log.history.length===5);
		
		Log.debug('','items');
		Log.debug(0,'items');
		Log.debug(false,'items');
		Log.debug(null,'items');
		Log.debug(undefined,'items');
		assert(Log.history.length===10);
		
		await Log.stop();
	});

	it("pause/resume",async function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js"
		});

		await Log.start();
		assert.strictEqual(Log.history.length,0);
		Log.info("Testing pause/resume 1.");
		assert.strictEqual(Log.history.length,1);
		Log.info("Testing pause/resume 2.");
		assert.strictEqual(Log.history.length,2);
		Log.pause();
		assert.strictEqual(Log.history.length,2);
		Log.info("Testing pause/resume 3.");
		assert.strictEqual(Log.history.length,2);
		Log.info("Testing pause/resume 4.");
		assert.strictEqual(Log.history.length,2);
		Log.resume();
		assert.strictEqual(Log.history.length,4);
		Log.info("Testing pause/resume 5.");
		assert.strictEqual(Log.history.length,5);
		await Log.stop();
	});
});
