// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const AbstractLogWriter = require("./AbstractLogWriter");
const AbstractLogFormatter = require("./AbstractLogFormatter");

const $WRITERS = Symbol("defined_writers");
const $FORMATTERS = Symbol("defined_formatters");

/**
 * @private
 *
 * LogExtensions manages the formatters and writers defined for AwesomeLog.
 * It is exposed only through `defineWriter` and `defineFormatter` in the
 * AwesomeLog class.
 */
class LogExtensions {
	/**
	 * @private
	 */
	constructor() {
		this[$WRITERS] = {};
		this[$FORMATTERS] = {};

		// define built in writers
		this.defineWriter("null",require("./writers/NullWriter"));
		this.defineWriter("nullwriter",require("./writers/NullWriter"));
		this.defineWriter("subprocess",require("./writers/SubProcessWriter"));
		this.defineWriter("default",require("./writers/ConsoleWriter"));
		this.defineWriter("console",require("./writers/ConsoleWriter"));
		this.defineWriter("consolewriter",require("./writers/ConsoleWriter"));
		this.defineWriter("stdout",require("./writers/ConsoleWriter"));
		this.defineWriter("file",require("./writers/FileWriter"));
		this.defineWriter("filewriter",require("./writers/FileWriter"));

		// define built in formatters
		this.defineFormatter("default",require("./formatters/DefaultFormatter"));
		this.defineFormatter("subprocess",require("./formatters/SubProcessFormatter"));
		this.defineFormatter("json",require("./formatters/JSONFormatter"));
		this.defineFormatter("js",require("./formatters/JSObjectFormatter"));
		this.defineFormatter("jsobject",require("./formatters/JSObjectFormatter"));
		this.defineFormatter("csv",require("./formatters/CSVFormatter"));
	}

	/**
	 * @private
	 *
	 * Returns an array of strings containing the defined Log Writer names that can be used.
	 *
	 * @return {Array<string>}
	 */
	get writers() {
		return AwesomeUtils.Object.extend(this[$WRITERS]);
	}

	/**
	 * @private
	 *
	 * Returns an array of strings containing the defined Log Formatter names that can be used.
	 *
	 * @return {Array<string>}
	 */
	get formatters() {
		return AwesomeUtils.Object.extend(this[$FORMATTERS]);
	}

	/**
	 * @private
	 *
	 * Returns an AbstractLogWriter implementation for the given name, or undefined.
	 *
	 * @param  {string} name [description]
	 * @return {AbstractLogWriter}      [description]
	 */
	getWriter(name) {
		if (!name) throw new Error("Missing writer name.");
		name = name.toLowerCase();

		return this[$WRITERS][name];
	}

	/**
	 * @private
	 *
	 * Returns an AbstractLogFormatter implementation for the given name, or undefined.
	 *
	 * @param  {string} name [description]
	 * @return {AbstractLogFormatter}      [description]
	 */
	getFormatter(name) {
		if (!name) throw new Error("Missing formatter name.");
		name = name.toLowerCase();

		return this[$FORMATTERS][name];
	}

	/**
	 * Map a new Log Writer to a specific name, for usage in configuring AwesomeLog.
	 *
	 * @param  {string} name
	 * @param  {Class<AbstractLogWriter>} logWriter
	 * @return {void}
	 */
	defineWriter(name,logWriter) {
		if (!name) throw new Error("Missing writer name.");
		name = name.toLowerCase();

		if (!logWriter) throw new Error("Missing writer constructor");
		if (!AbstractLogWriter.isPrototypeOf(logWriter)) throw new Error("Invalid writer constructor. Must inherit from AbstractLogWriter.");

		if (this[$WRITERS][name]) throw new Error("Writer already defined.");

		this[$WRITERS][name] = logWriter;
	}

	/**
	* Map a new Log Formatter to a specific name, for usage in configuring AwesomeLog.
	*
	* @param  {string} name
	* @param  {Class<AbstractLogFormatter>} logFormatter
	* @return {void}
	*/
	defineFormatter(name,logFormatter) {
		if (!name) throw new Error("Missing formatter name.");
		name = name.toLowerCase();

		if (!logFormatter) throw new Error("Missing formatter constructor");
		if (!AbstractLogFormatter.isPrototypeOf(logFormatter)) throw new Error("Invalid formatter constructor. Must inherit from AbstractLogFormatter.");

		if (this[$FORMATTERS][name]) throw new Error("Formatter already defined.");

		this[$FORMATTERS][name] = new logFormatter(this);
	}
}

module.exports = new LogExtensions();
