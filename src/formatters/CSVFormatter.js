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
	 * Given the log entry object, format it to our output string.
	 *
	 * @param  {Object} logentry
	 * @return {*}
	 */
	format(logentry) {
		let s = [];

		s.push(this.formatValue(logentry.timestamp||Date.now()));
		s.push(this.formatValue(logentry.level||""));
		s.push(this.formatValue(logentry.pid||"????"));
		s.push(this.formatValue(logentry.system||""));
		s.push(this.formatValue(logentry.text||""));
		if (logentry.args && logentry.args.length>0) s = s.concat(logentry.args.map((arg)=>{
			return this.formatValue(arg);
		}));

		s.concat(Object.keys(logentry).map((key)=>{
			if (key==="timestamp" || key==="level" || key==="pid" || key==="system" || key==="text" || key==="args") return;
			return this.formatValue(logentry[key]);
		}));

		return s.join(",");
	}

	/**
	 * @private
	 */
	formatValue(value) {
		if (value===null || value===undefined) return "";
		else if (typeof value==="string") return "\""+value+"\"";
		else if (typeof value==="number") return ""+value;
		else if (typeof value==="boolean") return ""+value;
		else if (value instanceof Date) return ""+value.getTime();
		else if (value instanceof Array) return "\""+this.formatCSVJSON(value)+"\"";
		else if (value instanceof Object) return "\""+this.formatCSVJSON(value)+"\"";
		else return "\""+value.toString()+"\"";
	}

	/**
	 * @private
	 */
	formatCSVJSON(obj) {
		let json = JSON.stringify(obj);
		json = json.replace(/"/g,'\\"');
		return json;
	}
}

module.exports = CSVFormatter;
