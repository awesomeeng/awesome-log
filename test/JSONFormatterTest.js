// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");


const AwesomeUtils = require("@awesomeeng/awesome-utils");

describe("AbstractLogFormatter",()=>{
	beforeEach(()=>{
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
	});

	afterEach(()=>{
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
	});

	it("json formatter",function(){
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "json"
		});
		Log.start();

		Log.info("Testing formatting...");
		assert(Log.history[0]);

		let entry = JSON.parse(Log.history[0]);
		assert(entry);
		assert(entry.timestamp);
		assert(entry.pid);
		assert.equal(entry.level,"INFO");
		assert(entry.system);
		assert.equal(entry.message,"Testing formatting...");
		assert.deepStrictEqual(entry.args,[]);

		Log.stop();
	});
});
