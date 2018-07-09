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
			writers: [],
			historyFormatter: "js"
		});
		Log.start();

		Log.access("Test","This is a ACCESS test.");
		Log.error("Test","This is a ERROR test.");
		Log.warn("Test","This is a WARN test.");
		Log.info("Test","This is a INFO test.");
		Log.debug("Test","This is a DEBUG test.");

		assert(Log.history.length===5);

		Log.stop();
	});

});
