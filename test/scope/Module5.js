// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("../../src/AwesomeLog.js");

class Module5 {
	constructor() {
		Log.happy("Module 5 Constructor.");
	}

	someFunction() {
		Log.happy("Module 5 Function.");
	}
}

module.exports = Module5;
