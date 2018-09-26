// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";


const AwesomeUtils = require("@awesomeeng/awesome-utils");
AwesomeUtils.Module.unrequire(require.resolve("./scope/Module1"));

const assert = require("assert");

describe("Scope",function(){
	beforeEach(()=>{
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
	});

	afterEach(()=>{
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"./scope/Module1"));
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"./scope/Module2"));
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"./scope/Module3"));
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"./scope/Module4"));
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"./scope/Module5"));
	});

	it("nested module1",function(){
		const Log = require("../src/AwesomeLog");
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

		Log.start();

		Log.info("Main");
		assert.equal(Log.history.length,1);

		require("./scope/Module1.js");
		assert.equal(Log.history.length,3);

		Log.stop();
	});

	it("nested module2",function(){
		const Log = require("../src/AwesomeLog");
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

		Log.start();

		Log.info("Main");
		assert.equal(Log.history.length,1);

		require("./scope/Module2.js");
		assert.equal(Log.history.length,5);

		Log.stop();
	});

	it("nested class",function(){
		const Log = require("../src/AwesomeLog");
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

		Log.start();

		Log.info("Main");
		assert.equal(Log.history.length,1);

		let M = require("./scope/Module4.js");
		let m = new M();
		m.someFunction();
		m.module5.someFunction();

		assert.equal(Log.history.length,7);

		Log.stop();
	});

	it("scope map",function(){
		const Log = require("../src/AwesomeLog");
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

		Log.start();

		Log.info("Main");
		require("./scope/Module1.js");
		assert(Log.history[0].indexOf("INFO")>-1);
		assert(Log.history[1].indexOf("ACCESS")>-1);
		assert(Log.history[2].indexOf("ERROR")>-1);

		Log.stop();
	});
});
