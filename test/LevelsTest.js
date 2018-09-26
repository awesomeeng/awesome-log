// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("LogLevels",()=>{
	beforeEach(()=>{
		const AwesomeUtils = require("@awesomeeng/awesome-utils");
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
	});

	afterEach(()=>{
		const AwesomeUtils = require("@awesomeeng/awesome-utils");
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
	});

	it("levels",function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			levels: "banana,apple,orange",
			disableLoggingNotices: true,
			historyFormatter: "js"
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
	});
});
