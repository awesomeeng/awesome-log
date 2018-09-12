// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractLogWriter = require("../AbstractLogWriter");

/**
 * A writer for outputing to /dev/null, thus outputting to nowhere.
 *
 * @extends AbstractLogWriter
 */
class NullWriter extends AbstractLogWriter {
	/**
	 * Creates a new Null Writer. Never called directly, but AwesomeLog
	 * will call this when `AwesomeLog.start()` is issued.
	 *
	 * NullWriter has no options.
	 *
	 * @param {AwesomeLog} parent
	 * @param {string} name
	 * @param {string} levels
	 * @param {AbstractLogFormatter} formatter
	 * @param {Object} options
	 */
	constructor(parent,name,levels,formatter,options) {
		super(parent,"Null",name,levels,formatter,options);
	}

	write(/*message,logentry*/) {
		// intentionally blank
	}

	flush() {
		// intentionally blank
	}

	close() {
		// intentionally blank
	}
}

module.exports = NullWriter;
