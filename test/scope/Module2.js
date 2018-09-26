// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const assert = require("assert");

const AwesomeLog = require("../../src/AwesomeLog.js");
const Log = new AwesomeLog();

Log.init({
	// writers: [{
	// 	name: "null",
	// 	type: "null"
	// }],
	levels: "happy,sad",
	disableLoggingNotices: true,
	historyFormatter: "default"
});
Log.start();

assert.equal(Log.history.length,0);
Log.happy("Module 2 is Happy.");

assert.equal(Log.history.length,1);
Log.sad("Module 2 is Sad.");

assert.equal(Log.history.length,2);

assert.throws(()=>{
	Log.debug("Module 2 is Debug.");
});
assert.equal(Log.history.length,2);

require("./Module3");

Log.stop();
