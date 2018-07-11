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

		let args = logentry.args || [];
		if (args.length>0) {
			let prefix = msg.replace(/./g," ")+" | ";
			args = args.map(formatArg.bind(this,prefix));

			msg += " : ";
			msg += logentry.message;
			msg += args;
		}
		else {
			msg += " : ";
			msg += logentry.message;
		}

		return msg;
	}
}

const formatArg = function formatArg(prefix,arg) {
	if (arg instanceof Error) {
		return "\n"+prefix+(arg.stack && arg.stack.split(/\n[\t\s]*/).join("\n"+prefix) || arg.message || ""+arg);
	}
	else if (arg instanceof Array || Lodash.isPlainObject(arg)) {
		return JSON.stringify(arg,null,2).split(/\n/).map((s)=>{
			return "\n"+prefix+s;
		}).join("");
	}
	else {
		return "\n"+prefix+arg;
	}
};

module.exports = DefaultFormatter;
