// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractLogWriter = require("../AbstractLogWriter");

/**
 * A writer for outputing to /dev/null, thus outputting to nowhere.
 *
 * NullWriter has no options.
 *
 * @extends AbstractLogWriter
 */
class NullWriter extends AbstractLogWriter {
	/**
	 * @private
	 *
	 * Creates a new Null Writer. Never called directly, but AwesomeLog
	 * will call this when `AwesomeLog.start()` is issued.
	 *
	 * @param {Object} options
	 */
	constructor(options) {
		super(options);
	}

	/**
	 * @private
	 */
	write(/*message,logentry*/) {
		// intentionally blank
	}

	/**
	 * @private
	 */
	flush() {
		// intentionally blank
	}

	/**
	 * @private
	 */
	close() {
		// intentionally blank
	}
}

module.exports = NullWriter;
