// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("AwesomeUtils");

const LogFormatter = require("../LogFormatter");

class DefaultFormatter extends LogFormatter {
	constructor(parent) {
		super(parent);
	}

	format(logentry) {
		let msg = "";

		msg += new Date(logentry.timestamp).toISOString();
		msg += " : ";
		msg += ("#"+logentry.pid).padEnd(6);
		msg += " : ";
		msg += logentry.level.name.slice(0,10).padEnd(10);
		msg += " : ";
		msg += logentry.system.slice(0,16).padEnd(16);

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
	else if (arg instanceof Array || AwesomeUtils.Object.isPlainObject(arg)) {
		return JSON.stringify(arg,null,2).split(/\n/).map((s)=>{
			return "\n"+prefix+s;
		}).join("");
	}
	else {
		return "\n"+prefix+arg;
	}
};

module.exports = DefaultFormatter;
