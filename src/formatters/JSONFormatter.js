// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractLogFormatter = require("../AbstractLogFormatter");

/**
 * The JSON AwesomeLog formatter. This produces log message in JSON form. This
 * will include all of the details in a log entry Object.
 *
 * @extends AbstractLogFormatter
 */
class JSONFormatter extends AbstractLogFormatter {
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
		if (logentry.args) logentry.args = logentry.args.map(formatArg.bind(this));
		return JSON.stringify(logentry);
	}

	
}

const formatArg = function formatArg(arg) {
	if (arg instanceof Error) {
		arg = {
			__TYPE: "error",
			message: arg.message,
			stack: arg.stack
		};
	}
	return arg;
};

module.exports = JSONFormatter;
