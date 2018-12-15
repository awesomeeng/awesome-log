// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const AbstractLogWriter = require("./AbstractLogWriter");
const AbstractLogFormatter = require("./AbstractLogFormatter");

const $WRITERS = Symbol("defined_writers");
const $FORMATTERS = Symbol("defined_formatters");

/**
 * @private
 */
/**
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
		this.defineWriter("null",AwesomeUtils.Module.resolve(module,"./writers/NullWriter"));
		this.defineWriter("nullwriter",AwesomeUtils.Module.resolve(module,"./writers/NullWriter"));
		this.defineWriter("default",AwesomeUtils.Module.resolve(module,"./writers/ConsoleWriter"));
		this.defineWriter("console",AwesomeUtils.Module.resolve(module,"./writers/ConsoleWriter"));
		this.defineWriter("consolewriter",AwesomeUtils.Module.resolve(module,"./writers/ConsoleWriter"));
		this.defineWriter("stdout",AwesomeUtils.Module.resolve(module,"./writers/ConsoleWriter"));
		this.defineWriter("file",AwesomeUtils.Module.resolve(module,"./writers/FileWriter"));
		this.defineWriter("filewriter",AwesomeUtils.Module.resolve(module,"./writers/FileWriter"));

		// define built in formatters
		this.defineFormatter("null",AwesomeUtils.Module.resolve(module,"./formatters/NullFormatter"));
		this.defineFormatter("default",AwesomeUtils.Module.resolve(module,"./formatters/DefaultFormatter"));
		this.defineFormatter("json",AwesomeUtils.Module.resolve(module,"./formatters/JSONFormatter"));
		this.defineFormatter("js",AwesomeUtils.Module.resolve(module,"./formatters/JSObjectFormatter"));
		this.defineFormatter("jsobject",AwesomeUtils.Module.resolve(module,"./formatters/JSObjectFormatter"));
		this.defineFormatter("csv",AwesomeUtils.Module.resolve(module,"./formatters/CSVFormatter"));
	}

	/**
	 * @private
	 */
	/**
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
	 */
	/**
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
	 */
	/**
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
	 */
	/**
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
	 * Map a new Log Writer at the given filename to a specific name, for usage in configuring AwesomeLog.
	 * The filename given must export a class that extends AbstractLogWriter.
	 *
	 * @param  {string} name
	 * @param  {string} filename
	 * @return {void}
	 */
	defineWriter(name,filename) {
		if (!name) throw new Error("Missing writer name.");
		if (typeof name!=="string") throw new Error("Invalid writer name.");
		if (!filename) throw new Error("Missing writer filename.");
		if (typeof filename!=="string") throw new Error("Invalid writer filename.");

		name = name.toLowerCase();
		if (this[$WRITERS][name]) throw new Error("Writer already defined.");

		if (!AwesomeUtils.FS.existsSync(filename)) throw new Error("Writer not found at "+filename+".");

		let logWriter = require(filename);
		if (!AbstractLogWriter.isPrototypeOf(logWriter)) throw new Error("Invalid writer constructor. Must inherit from AbstractLogWriter.");

		this[$WRITERS][name] = filename;
	}

	/**
	* Map a new Log Formatter to a specific filename, for usage in configuring AwesomeLog.
	* The filename given must export a class that extends AbstractLogFormatter.
	*
	* @param  {string} name
	* @param  {string} filename
	* @return {void}
	*/
	defineFormatter(name,filename) {
		if (!name) throw new Error("Missing formatter name.");
		if (typeof name!=="string") throw new Error("Invalid formatter name.");
		if (!filename) throw new Error("Missing formatter filename.");
		if (typeof filename!=="string") throw new Error("Invalid formatter filename.");

		name = name.toLowerCase();
		if (this[$FORMATTERS][name]) throw new Error("Formatter already defined.");

		if (!AwesomeUtils.FS.existsSync(filename)) throw new Error("Formatter not found at "+filename+".");

		let logFormatter = require(filename);
		if (!AbstractLogFormatter.isPrototypeOf(logFormatter)) throw new Error("Invalid formatter constructor. Must inherit from AbstractLogFormatter.");

		this[$FORMATTERS][name] = filename;
	}
}

module.exports = new LogExtensions();
