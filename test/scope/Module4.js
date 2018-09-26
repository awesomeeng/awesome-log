// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("../../src/AwesomeLog.js");

const Module5 = require("./Module5");

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
Log.happy("Module 4 Global.");

class Module4 {
	constructor() {
		Log.happy("Module 4 Constructor.");
		this.module5 = new Module5();
	}

	someFunction() {
		Log.happy("Module 4 Function.");
		this.module5.someFunction();
	}
}

module.exports = Module4;
