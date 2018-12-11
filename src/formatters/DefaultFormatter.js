// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const AbstractLogFormatter = require("../AbstractLogFormatter");

/**
 * The default AwesomeLog formatter. This produces log message in the following form:
 *
 * ```
 * ISO TIMESTAMP            : #PID   : LEVEL      : SYSTEM           : MESSAGE
 * ```
 *
 * For example...
 *
 * ```
 * 2018-09-13T17:47:37.201Z : #12080 : INFO       : AwesomeLog.js    : AwesomeLog initialized.
 * 2018-09-13T17:47:37.207Z : #12080 : INFO       : AwesomeLog.js    : AwesomeLog started.
 * 2018-09-13T17:47:37.208Z : #12080 : INFO       : Example.js       : This is an example log message.
 * ```
 *
 * @extends AbstractLogFormatter
 */
class DefaultFormatter extends AbstractLogFormatter {
	/**
	 * @private
	 */
	/**
	 *
	 * Constructor for this formatter. Never called directly, but called by AwesomeLog
	 * when `Log.start()` is called.
	 *
	 * @param {Object} options
	 */
	constructor(options) {
		super(options);
	}

	/**
	 * @private
	 */
	/**
	 *
	 * Given the log entry object, format it tou our output string.
	 *
	 * @param  {Object} logentry
	 * @return {*}
	 */
	format(logentry) {
		let msg = "";

		msg += new Date(logentry.timestamp||Date.now()).toISOString();
		msg += " : ";
		msg += ("#"+logentry.pid||"????").padEnd(6);
		msg += " : ";
		msg += (logentry.level||"").slice(0,10).padEnd(10);
		msg += " : ";
		msg += (logentry.system||"").slice(0,16).padEnd(16);

		let args = logentry.args || [];
		if (args.length>0) {
			let prefix = msg.replace(/./g," ")+" | ";
			args = args.map(formatArg.bind(this,prefix));

			msg += " : ";
			msg += logentry.text||"";
			msg += args;
		}
		else {
			msg += " : ";
			msg += logentry.text||"";
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
