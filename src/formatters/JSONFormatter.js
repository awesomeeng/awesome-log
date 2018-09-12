// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractLogFormatter = require("../AbstractLogFormatter");

class JSONFormatter extends AbstractLogFormatter {
	constructor(parent) {
		super(parent);
	}

	format(logentry) {
		return JSON.stringify(logentry);
	}
}

module.exports = JSONFormatter;
