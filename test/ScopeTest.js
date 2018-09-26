// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const AwesomeLog = require("../src/AwesomeLog");
const Log = new AwesomeLog();

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const assert = require("assert");

describe("Scope",function(){

	afterEach(()=>{
		AwesomeUtils.Module.unrequire(require.resolve("./scope/Module1"));
		AwesomeUtils.Module.unrequire(require.resolve("./scope/Module2"));
		AwesomeUtils.Module.unrequire(require.resolve("./scope/Module3"));
		AwesomeUtils.Module.unrequire(require.resolve("./scope/Module4"));
		AwesomeUtils.Module.unrequire(require.resolve("./scope/Module5"));
	});

	// it("nested module1",function(){
	// 	Log.init({
	// 		// writers: [{
	// 		// 	name: "null",
	// 		// 	type: "null"
	// 		// }],
	// 		disableLoggingNotices: true,
	// 		historyFormatter: "default",
	// 		scopeMap: {
	// 			happy: "access",
	// 			sad: "error"
	// 		}
	// 	});
	// 	Log.start();
	// 	Log.info("Main 1");
	// 	assert.equal(Log.history.length,1);
	//
	// 	require("./scope/Module1.js");
	// 	assert.equal(Log.history.length,3);
	// });

	it("nested module2",function(){
		Log.init({
			// writers: [{
			// 	name: "null",
			// 	type: "null"
			// }],
			disableLoggingNotices: true,
			historyFormatter: "default",
			scopeMap: {
				happy: "access",
				sad: "error"
			}
		});
		Log.start();
		Log.info("Main 2");
		assert.equal(Log.history.length,1);

		require("./scope/Module2.js");
		assert.equal(Log.history.length,5);
	});

	// it("nested class",function(){
	// 	Log.init({
	// 		// writers: [{
	// 		// 	name: "null",
	// 		// 	type: "null"
	// 		// }],
	// 		disableLoggingNotices: true,
	// 		historyFormatter: "default",
	// 		scopeMap: {
	// 			happy: "access",
	// 			sad: "error"
	// 		}
	// 	});
	// 	Log.start();
	// 	Log.info("Main 2");
	// 	assert.equal(Log.history.length,1);
	//
	// 	let M = require("./scope/Module4.js");
	// 	let m = new M();
	// 	m.someFunction();
	// 	m.module5.someFunction();
	//
	// 	assert.equal(Log.history.length,6);
	// });

	// it("scope map",function(){
	// Log.init({
	// 	// writers: [{
	// 	// 	name: "null",
	// 	// 	type: "null"
	// 	// }],
	// 	disableLoggingNotices: true,
	// 	historyFormatter: "default",
	// 	scopeMap: {
	// 		happy: "access",
	// 		sad: "error"
	// 	}
	// });
	// 	Log.start();
	// 	Log.info("Main 3");
	// 	require("./scope/Module1.js");
	// 	assert(Log.history[0].indexOf("INFO")>-1);
	// 	assert(Log.history[1].indexOf("ACCESS")>-1);
	// 	assert(Log.history[2].indexOf("ERROR")>-1);
	// });
});
