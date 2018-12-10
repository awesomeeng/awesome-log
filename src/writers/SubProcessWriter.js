// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractLogWriter = require("../AbstractLogWriter");
let Worker;
try {
	Worker = require('worker_threads');
}
catch (ex) {
	Worker = null;
}

/**
 * A writer for usage by child process / cluster / worker threads. This is
 * used internally by AwesomeLog with child processes.
 *
 * SubProcessWriter takes no additional options.
 *
 * @extends AbstractLogWriter
 */
class SubProcessWriter extends AbstractLogWriter {
	/**
	 * @private
	 *
	 * Creates a new SubProcess Writer.
	 *
	 * @param {Object} options
	 */
	constructor(options) {
		super(options);
	}

	/**
	 * @private
	 *
	 * Write a log message to a parent process.
	 *
	 * @param {*} message
	 * @param {Object} logentry
	 * @return {void}
	 */
	write(message,logentry) {
		logentry = Object.assign(logentry);
		logentry.level = logentry.level && logentry.level.name || logentry.level;

		if (Worker && Worker.parentPort && Worker.parentPort.postMessage) {
			Worker.parentPort.postMessage({
				cmd: "AWESOMELOG.ENTRY",
				logentry
			});
		}
		else if (process.send) {
			process.send({
				cmd: "AWESOMELOG.ENTRY",
				logentry
			});
		}
	}

	/**
	 * @private
	 *
	 * Flush the pending writes. This has not effect in this case.
	 *
	 * @return {void}
	 */
	flush() {
		// intentionally blank
	}

	/**
	 * @private
	 *
	 * Close the writer. This has not effect in this case.
	 *
	 * @return {void}
	 */
	close() {
		// intentionally blank
	}
}

module.exports = SubProcessWriter;
