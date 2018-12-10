// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const AbstractLogWriter = require("../AbstractLogWriter");

const $THEME = Symbol("theme");

/**
 * A writer for outputing to STDOUT. This is the default writer used if
 * no writers are provided to `AwesomeLog.init()`.
 *
 * Supports writing to STDOUT only.  Allows for optional ANSI color
 * escape sequences to be included.
 *
 * The following options can be used to configure this Console Writer.
 * Here are the default configuration values:
 *
 * ```
 * options = {
 *   colorize: true,
 *   colorStyle: "level", // "line" or "level"
 *   colors: {
 * 	   ACCESS: "green",
 * 	   ERROR: "red",
 * 	   WARN: "yellow",
 * 	   INFO: "magenta",
 * 	   DEBUG: "cyan",
 *   }
 * }
 * ```
 *
 * See Our {@link ./docs/ConsoleWriterConfiguration.md Console Writer Configuration}
 * documentation for more details.
 *
 * @extends AbstractLogWriter
 */
class ConsoleWriter extends AbstractLogWriter {
	/**
	 * @private
	 *
	 * Creates a new Console Writer. Never called directly, but AwesomeLog
	 * will call this when `AwesomeLog.start()` is issued.
	 *
	 * @param {Object} options
	 */
	constructor(options) {
		options = AwesomeUtils.Object.extend({
			colorize: true,
			colorStyle: "level", // "line" or "level"
			colors: {
				ACCESS: "green",
				ERROR: "red",
				WARN: "yellow",
				INFO: "magenta",
				DEBUG: "cyan",
			}
		},options);

		super(options);

		if (this.options.colorize) {
			let theme = {};
			Object.keys(this.options.colors||{}).forEach((level)=>{
				theme[level] = this.options.colors[level];
			});
			this[$THEME] = theme;
		}
	}

	/**
	 * @private
	 *
	 * Write a log message to STDOUT.
	 *
	 * @param {*} message
	 * @param {Object} logentry
	 * @return {void}
	 */
	write(message,logentry) {
		message = ""+message;
		if (this.options.colorize) {
			if (this.options.colorStyle==="level") process.stdout.write(message.replace(logentry.level,AwesomeUtils.ANSI.stylize(this[$THEME][logentry.level],(logentry.level)))+"\n");
			else process.stdout.write(AwesomeUtils.ANSI.stylize(this[$THEME][logentry.level],message)+"\n");
		}
		else process.stdout.write(message+"\n");
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

module.exports = ConsoleWriter;
