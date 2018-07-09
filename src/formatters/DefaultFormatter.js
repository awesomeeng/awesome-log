// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Lodash = require("lodash");

const LogFormatter = require("../LogFormatter");

class DefaultFormatter extends LogFormatter {
	constructor(parent) {
		super(parent);
	}

	format(logentry) {
		let msg = "";

		msg += new Date(logentry.timestamp).toISOString();
		msg += " : ";
		msg += Lodash.padEnd("#"+logentry.pid+"",6);
		msg += " : ";
		msg += Lodash.padEnd(Lodash.truncate(logentry.level.name,8),8);
		msg += " : ";
		msg += Lodash.padEnd(Lodash.truncate(logentry.system,16),16);
		msg += " : ";
		msg += logentry.message;

		return msg;
	}
}

module.exports = DefaultFormatter;
