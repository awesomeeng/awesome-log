// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

const AwesomeLog = require("../src/AwesomeLog");
const Log = new AwesomeLog();

describe("AwesomeLog",()=>{
	it("initialize",()=>{
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
		});
		assert(Log.initialized);
	});

	it("start",()=>{
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
		});
		assert(!Log.running);
		Log.start();
		assert(Log.running);
		Log.stop();
	});

	it("stop",()=>{
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
		});
		assert(!Log.running);
		Log.start();
		assert(Log.running);
		Log.stop();
		assert(!Log.running);
	});

	it("log",()=>{
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			historyFormatter: "js",
			disableLoggingNotices: true,
		});
		Log.start();

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

		Log.stop();
		Log.start();
		assert(Log.history.length===0);
		Log.log("access","The quick brown fox jumped over the lazy dog.");
		assert.equal(Log.history.length,1);
		assert(Log.history[0].pid>0);
		assert(Log.history[0].timestamp>0);
		assert.equal(Log.history[0].level,"ACCESS");
		assert(Log.history[0].system);
		assert.equal(Log.history[0].message,"The quick brown fox jumped over the lazy dog.");
		assert(Log.history[0].args.length<1);

		Log.stop();
	});

	it("pause/resume",function(){
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
		});
		Log.start();
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
		Log.stop();
	});

	it("levels",function(){
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			levels: "banana,aPPle,orangE",
			historyFormatter: "js",
			disableLoggingNotices: true
		});

		assert.equal(Log.levelNames.length,3);
		assert(Log.levelNames.indexOf("BANANA")>-1);
		assert(Log.levelNames.indexOf("APPLE")>-1);
		assert(Log.levelNames.indexOf("ORANGE")>-1);

		Log.start();

		try {
			Log.access("This is a ACCESS test.");
			assert(false);
		}
		catch (ex) {
			assert(true);
		}
		try {
			Log.error("This is a ERROR test.");
			assert(false);
		}
		catch (ex) {
			assert(true);
		}
		try {
			Log.warn("This is a WARN test.");
			assert(false);
		}
		catch (ex) {
			assert(true);
		}
		try {
			Log.info("This is a INFO test.");
			assert(false);
		}
		catch (ex) {
			assert(true);
		}
		try {
			Log.debug("This is a DEBUG test.");
			assert(false);
		}
		catch (ex) {
			assert(true);
		}

		Log.banana("This is a ACCESS test.");
		Log.orange("This is a ERROR test.");
		Log.apple("This is a WARN test.");
		assert.equal(Log.history.length,3);

		Log.apple("This is a INFO test.");
		Log.orange("This is a INFO test.");
		Log.banana("This is a DEBUG test.");

		assert(Log.history.length===6);

		Log.stop();
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			levels: "banana,apple,orange,gar$bage,spa ced",
			historyFormatter: "js",
			disableLoggingNotices: true
		});
		Log.start();

		Log.levels.forEach((level)=>{
			assert(level.name.match(/^\w+$/));
		});

		assert(Log.history.length===0);

		Log.stop();
	});

	it("events",function(done){
		let x = 0;

		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true
		});

		Log.once("started",() => x+=1);
		Log.on("log",() => x+=2);
		Log.once("paused",() => x+=3);
		Log.once("resumed",() => x+=5);
		Log.once("stopped",() => {
			assert.equal(x,13);
			done();
		});

		Log.start();
		Log.debug("testing events 1.");
		Log.pause();
		Log.debug("testing events 2.");
		Log.resume();
		Log.stop();
	});
});
