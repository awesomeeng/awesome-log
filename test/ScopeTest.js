// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const Log = require("../src/AwesomeLog");

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const assert = require("assert");

describe("Scope",function(){
	beforeEach(()=>{
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "default",
			scopeMap: {
				happy: "access",
				sad: "error"
			}
		});
	});

	afterEach(()=>{
		Log.stop();
		AwesomeUtils.Module.unrequire(require.resolve("./scope/Module1"));
		AwesomeUtils.Module.unrequire(require.resolve("./scope/Module2"));
		AwesomeUtils.Module.unrequire(require.resolve("./scope/Module3"));
	});

	it("nested module",function(){
		Log.start();
		Log.info("Main 1");
		assert.equal(Log.history.length,1);

		require("./scope/Module1.js");
		assert.equal(Log.history.length,3);
	});

	it("nested modules",function(){
		Log.start();
		Log.info("Main 2");
		assert.equal(Log.history.length,1);

		require("./scope/Module2.js");
		assert.equal(Log.history.length,5);
	});

	it("scope map",function(){
		Log.start();
		Log.info("Main 3");
		require("./scope/Module1.js");
		assert(Log.history[0].indexOf("INFO")>-1);
		assert(Log.history[1].indexOf("ACCESS")>-1);
		assert(Log.history[2].indexOf("ERROR")>-1);
	});
});
