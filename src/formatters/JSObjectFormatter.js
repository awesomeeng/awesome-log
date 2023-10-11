// (c) 2018-2023, The Awesome Engineering Company, https://awesomeeng.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const AbstractLogFormatter = require("../AbstractLogFormatter");

/**
 * The JS Object AwesomeLog formatter. This simply forwards the log entry Object onward
 * for usage programatically. It does not produce a readable string.
 *
 * @extends AbstractLogFormatter
 */
class JSObjectFormatter extends AbstractLogFormatter {
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
		return AwesomeUtils.Object.extend({},logentry);
	}
}

module.exports = JSObjectFormatter;
