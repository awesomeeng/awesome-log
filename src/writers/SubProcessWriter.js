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
 * @extends AbstractLogWriter
 */
class SubProcessWriter extends AbstractLogWriter {
	/**
	 * Creates a new SubProcess Writer.
	 *
	 * SubProcessWriter takes no additional options.
	 *
	 * @param {AwesomeLog} parent
	 * @param {string} name
	 * @param {string} levels
	 * @param {AbstractLogFormatter} formatter
	 * @param {Object} options
	 */
	constructor(parent,name,levels,formatter,options) {
		super(parent,"SubProcess",name,levels,formatter,options);
	}

	/**
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
				cmd: "AwesomeLog",
				logentry
			});
		}
		else if (process.send) {
			process.send({
				cmd: "AwesomeLog",
				logentry
			});
		}
	}

	/**
	 * Flush the pending writes. This has not effect in this case.
	 *
	 * @return {void}
	 */
	flush() {
		// intentionally blank
	}

	/**
	 * Close the writer. This has not effect in this case.
	 *
	 * @return {void}
	 */
	close() {
		// intentionally blank
	}
}

module.exports = SubProcessWriter;
