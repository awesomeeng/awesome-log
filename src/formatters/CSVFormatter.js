// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractLogFormatter = require("../AbstractLogFormatter");

/**
 * The CSV AwesomeLog formatter. This produces the following CSV data...
 *
 * ```
 * TIMESTAMP,"LEVEL",PID,"SYSTEM","MESSAGE",ARG0,ARG1,ARG2,ETC

 * ```
 *
 * Note that this does not write a CSV header line.
 *
 * @extends AbstractLogFormatter
 */
class CSVFormatter extends AbstractLogFormatter {
	/**
	 * Constructor for this formatter. Never called directly, but called by AwesomeLog
	 * when `Log.start()` is called.
	 *
	 * @param {AwesomeLog} parent
	 */
	constructor(parent) {
		super(parent);
	}

	// timestamp,"level",pid,"system","message",arg0,arg1,arg2,etc
	/**
	 * Given the log entry object, format it tou our output string.
	 *
	 * @param  {Object} logentry
	 * @return {*}
	 */
	format(logentry) {
		let s = [];

		s.push(""+logentry.timestamp);
		s.push("\""+logentry.level.name+"\"");
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

module.exports = CSVFormatter;
