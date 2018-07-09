// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const LogFormatter = require("../LogFormatter");

class JSONFormatter extends LogFormatter {
	constructor(parent) {
		super(parent);
	}

	format(logentry) {
		return JSON.stringify(logentry);
	}
}

module.exports = JSONFormatter;
