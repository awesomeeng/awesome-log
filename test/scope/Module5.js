// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeLog = require("../../src/AwesomeLog.js");
const Log = new AwesomeLog();

class Module5 {
	constructor() {
		console.log(30,Log.id);
		Log.happy("Module 5 Constructor.");
	}

	someFunction() {
		Log.happy("Module 5 Function.");
	}
}

module.exports = Module5;
