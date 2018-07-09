// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

const Log = require("../src/Log");

describe("Log",()=>{
	beforeEach(()=>{
		Log.stop();
		Log.init({});
	});

	afterEach(()=>{
		Log.stop();
	});

	it("Log.initialize()",()=>{
		Log.init();
		assert(Log.initialized);
	});

	it("Log.start()",()=>{
		assert(!Log.running);
		Log.start();
		assert(Log.running);
	});

	it("Log.stop()",()=>{
		assert(!Log.running);
		Log.start();
		assert(Log.running);
		Log.stop();
		assert(!Log.running);
	});

	it("Log.log()",()=>{
		Log.start();
		Log.stop();
		Log.init({
			// writers: [],
			historyFormatter: "js"
		});
		Log.start();

		Log.log("ACCESS","Test","This is a ACCESS test.");
		Log.log("ERROR","Test","This is a ERROR test.");
		Log.log("WARN","Test","This is a WARN test.");
		Log.log("INFO","Test","This is a INFO test.");
		Log.log("DEBUG","Test","This is a DEBUG test.");
		assert(Log.history.length===5);

		Log.log("ACCESS","Test","This is a ACCESS test.");
		Log.log("ERROR","Test","This is a ERROR test.");
		Log.log("WARN","Test","This is a WARN test.");
		Log.log("INFO","Test","This is a INFO test.");
		Log.log("DEBUG","Test","This is a DEBUG test.");
		assert(Log.history.length===10);

		Log.stop();
		Log.start();
		assert(Log.history.length===0);
		Log.log("access","test test test","The quick brown fox jumped over the lazy dog.");
		assert.equal(Log.history.length,1);
		assert(Log.history[0].pid>0);
		assert(Log.history[0].timestamp>0);
		assert.equal(Log.history[0].level,"ACCESS");
		assert.equal(Log.history[0].system,"testtesttest");
		assert.equal(Log.history[0].message,"The quick brown fox jumped over the lazy dog.");
		assert(Log.history[0].args.length<1);

		Log.stop();
	});

	it("Log.levels()",function(){
		Log.stop();
		Log.init({
			writers: [],
			levels: "banana,aPPle,orangE",
			historyFormatter: "js"
		});

		assert.equal(Log.levelNames.length,9);
		assert(Log.levelNames.indexOf("BANANA")>-1);
		assert(Log.levelNames.indexOf("Banana")>-1);
		assert(Log.levelNames.indexOf("banana")>-1);
		assert(Log.levelNames.indexOf("APPLE")>-1);
		assert(Log.levelNames.indexOf("Apple")>-1);
		assert(Log.levelNames.indexOf("apple")>-1);
		assert(Log.levelNames.indexOf("ORANGE")>-1);
		assert(Log.levelNames.indexOf("Orange")>-1);
		assert(Log.levelNames.indexOf("orange")>-1);

		Log.start();

		try {
			Log.access("Test","This is a ACCESS test.");
			assert(false);
		}
		catch (ex) {
			assert(true);
		}
		try {
			Log.error("Test","This is a ERROR test.");
			assert(false);
		}
		catch (ex) {
			assert(true);
		}
		try {
			Log.warn("Test","This is a WARN test.");
			assert(false);
		}
		catch (ex) {
			assert(true);
		}
		try {
			Log.info("Test","This is a INFO test.");
			assert(false);
		}
		catch (ex) {
			assert(true);
		}
		try {
			Log.debug("Test","This is a DEBUG test.");
			assert(false);
		}
		catch (ex) {
			assert(true);
		}

		Log.banana("Test","This is a ACCESS test.");
		Log.orange("Test","This is a ERROR test.");
		Log.apple("Test","This is a WARN test.");
		assert.equal(Log.history.length,3);

		Log.apple("Test","This is a INFO test.");
		Log.orange("Test","This is a INFO test.");
		Log.banana("Test","This is a DEBUG test.");

		assert(Log.history.length===6);

		Log.stop();
		Log.init({
			writers: [],
			levels: "banana,apple,orange,gar$bage,spa ced",
			historyFormatter: "js"
		});
		Log.start();

		Log.levels.forEach((level)=>{
			assert(level.name.match(/^\w+$/));
		});

		assert(Log.history.length===0);
	});



});
