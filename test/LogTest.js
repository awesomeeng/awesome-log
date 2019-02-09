// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("AwesomeLog",()=>{
	beforeEach(()=>{
		const AwesomeUtils = require("@awesomeeng/awesome-utils");
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));

	});

	afterEach(()=>{
		const AwesomeUtils = require("@awesomeeng/awesome-utils");
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
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

		await Log.stop();
		await Log.start();

		assert(Log.history.length===0);
		Log.log("access","The quick brown fox jumped over the lazy dog.");
		assert.equal(Log.history.length,1);
		assert(Log.history[0].pid>0);
		assert(Log.history[0].timestamp>0);
		assert.equal(Log.history[0].level,"ACCESS");
		assert(Log.history[0].system);
		assert.equal(Log.history[0].text,"The quick brown fox jumped over the lazy dog.");
		assert(Log.history[0].args.length<1);

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
		assert.equal(Log.history.length,0);
		Log.info("Testing pause/resume 1.");
		assert.equal(Log.history.length,1);
		Log.info("Testing pause/resume 2.");
		assert.equal(Log.history.length,2);
		Log.pause();
		assert.equal(Log.history.length,2);
		Log.info("Testing pause/resume 3.");
		assert.equal(Log.history.length,2);
		Log.info("Testing pause/resume 4.");
		assert.equal(Log.history.length,2);
		Log.resume();
		assert.equal(Log.history.length,4);
		Log.info("Testing pause/resume 5.");
		assert.equal(Log.history.length,5);
		await Log.stop();
	});
});
