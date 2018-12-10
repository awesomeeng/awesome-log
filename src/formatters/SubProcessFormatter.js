// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractLogFormatter = require("../AbstractLogFormatter");

/**
 * The SubProcess AwesomeLog formatter. This produces log message for usage with child
 * processes and is only used internall by AwesomeLog.
 *
 * @extends AbstractLogFormatter
 */
class SubProcessFormatter extends AbstractLogFormatter {
	/**
	 * @private
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
	 *
	 * Given the log entry object, format it tou our output string.
	 *
	 * @param  {Object} logentry
	 * @return {*}
	 */
	format(logentry) {
		let s = [];

		s.push("@AWESOMELOG");
		s.push(""+logentry.timestamp);
		s.push("\""+logentry.level+"\"");
		s.push(""+logentry.pid);
		s.push("\""+logentry.system+"\"");
		s.push("\""+logentry.message+"\"");
		if (logentry.args && logentry.args.length>0) s = s.concat(logentry.args.map((arg)=>{
			if (arg===null || arg===undefined) return "";
			else if (typeof arg==="string") return "\""+arg+"\"";
			else if (typeof arg==="number") return ""+arg;
			else if (typeof arg==="boolean") return ""+arg;
			else if (arg instanceof Date) return ""+arg.getTime();
			else if (arg instanceof Array) return "\""+this.formatCSVJSON(arg)+"\"";
			else if (arg instanceof Object) return "\""+this.formatCSVJSON(arg)+"\"";
			else return arg.toString();
		}));
		return s.join(",");
	}

	formatCSVJSON(obj) {
		let json = JSON.stringify(obj);
		json = json.replace(/"/g,'\\"');
		return json;
	}
}

module.exports = SubProcessFormatter;
