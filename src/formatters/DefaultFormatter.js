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
 * The default formatter can take the following options: 
 * 
 * 		options = {
 * 			oneline: false
 * 		}
 *
 * 		oneline: if set to true, puts arguments on the same line as the log entry thus ensuring one line === one entry.
 * 				 By default this is false, meaning any arguments supplied to a log entry over and above the message
 * 				 are rendered into multiple lines.
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
		options = AwesomeUtils.Object.extend({
			oneline: false
		},options);

		super(options);
	}

	/**
	 * @private
	 */
	/**
	 *
	 * Given the log entry object, format it out our output string.
	 *
	 * @param  {Object} logentry
	 * @return {*}
	 */
	format(logentry) {
		let msg = [];

		if (logentry.timestamp) msg.push(new Date(logentry.timestamp||Date.now()).toISOString());
		if (logentry.pid) msg.push(("#"+logentry.pid||"????").padEnd(6));
		if (logentry.ppid) msg.push(("##"+logentry.ppid||"????").padEnd(6));
		if (logentry.level) msg.push((logentry.level).slice(0,10).padEnd(10));
		if (logentry.system) msg.push((logentry.system).slice(0,16).padEnd(16));
		if (logentry.hostname) msg.push((logentry.hostname));
		if (logentry.domain) msg.push((logentry.domain));
		if (logentry.servername) msg.push((logentry.servername));
		if (logentry.main) msg.push((logentry.main));
		if (logentry.execpath) msg.push((logentry.execpath));
		if (logentry.argv) msg.push((JSON.stringify(logentry.argv)));
		if (logentry.arch) msg.push((logentry.arch));
		if (logentry.platform) msg.push((logentry.platform));
		if (logentry.bits) msg.push((""+logentry.bits));
		if (logentry.cpus) msg.push((""+logentry.cpus));
		if (logentry.startingdir) msg.push((logentry.startingdir));
		if (logentry.homedir) msg.push((logentry.homedir));
		if (logentry.username) msg.push((logentry.username));
		if (logentry.version) msg.push((logentry.version));

		msg = msg.join(" : ");
		
		let prefix = msg.replace(/./g," ")+" | ";
		
		msg += " : ";
		msg += logentry.text||"";

		let args = logentry.args || [];
		if (args.length>0) {
			if (this.options.oneline) {
				args = args.map(formatArgOneline.bind(this));

				msg += " : ";
				msg += "[ "+args.join(" | ")+" ]";
			}
			else {
				args = args.map(formatArgMultiline.bind(this,prefix));
	
				msg += args;
			}
		}

		return msg;
	}
}

const formatArgMultiline = function formatArg(prefix,arg) {
	if (arg instanceof Error) {
		let text = "\n";
		if (arg.stack) {
			text += prefix + arg.stack.split(/\n[\t\s]*/).join("\n"+prefix);
			if (arg.cause) text = text
				+ "\n"+prefix+""
				+ "\n"+prefix+"Caused by: "
				+ formatArgMultiline(prefix+"  ",arg.cause).replace(/\n$/,"");
		}
		else if (arg.message) {
			text += prefix + arg.message;
		}
		else {
			text += prefix + ("" + arg);
		}
		return text;
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


const formatArgOneline = function formatArgOneline(arg) {
	if (arg instanceof Error) {
		let text = "";
		if (arg.stack) {
			text += arg.stack.split(/\n[\t\s]*/).join(" ");
			if (arg.cause) text += " [ Caused by: " + formatArgOneline(arg.cause)+" ]";
		}
		else if (arg.message) {
			text += arg.message;
		}
		else {
			text += ("" + arg);
		}
		return text;
	}
	else if (arg instanceof Array || AwesomeUtils.Object.isPlainObject(arg)) {
		return JSON.stringify(arg);
	}
	else {
		return ""+arg;
	}
};

module.exports = DefaultFormatter;
