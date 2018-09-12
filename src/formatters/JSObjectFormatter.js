// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractLogFormatter = require("../AbstractLogFormatter");

class JSObjectFormatter extends AbstractLogFormatter {
	constructor(parent) {
		super(parent);
	}

	format(logentry) {
		return {
			timestamp: logentry.timestamp,
			pid: logentry.pid,
			level: logentry.level.name,
			system: logentry.system,
			message: logentry.message,
			args: logentry.args
		};
	}
}

module.exports = JSObjectFormatter;
