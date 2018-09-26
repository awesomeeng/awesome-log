// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const AbstractLogFormatter = require("./AbstractLogFormatter");

const $TYPE = Symbol("type");
const $NAME = Symbol("name");
const $OPTIONS = Symbol("options");
const $LEVELS = Symbol("levels");
const $FORMATTER = Symbol("formatter");
const $PARENT = Symbol("parent");

/**
 * Describes the shape of a Log Writer. This class is expected to be extend for all
 * Log Writer implementations. After this class is extended, you pass the extending
 * class into `AwesomeLog.defineLogWriter(name,class)` to add your Log Writer to
 * AwesomeLog for usage.
 *
 * @see {@link ./docs/LogWriters.md Log Writer} documentation for more details.
 *
 * @interface
 */
class AbstractLogWriter {
	/**
	 * Constructor for a Log Writer.
	 *
	 * It is important to note that this constructor is never called by you, but
	 * is instead called by AwesomeLog when the `start()` command is issued.
	 *
	 * Your class must call this as shown here:
	 *
	 * ```
	 * class MyWriter extends AbstractLogWriter {
	 * 	 constructor(parent,type,name,levels,formatter,options) {
	 * 	   super(parent,type,name,levels,formatter,options);
	 *
	 * 	   ... your initialization code ...
	 * 	 }
	 * }
	 * ```
	 *
	 * Failure to not do the super constructor will result in errors.
	 *
	 * You should put any kind of initialization of your writer in this constructor.
	 *
	 * @param {AwesomeLog} parent
	 * @param {string} type
	 * @param {string} name
	 * @param {string} levels
	 * @param {AbstractLogFormatter} formatter
	 * @param {Object} options
	 */
	constructor(parent,type,name,levels,formatter,options) {
		this[$PARENT] = parent;

		if (!type) throw new Error("Missing type argument.");
		if (typeof type!=="string") throw new Error("Invalid type argument");
		this[$TYPE] = type;

		if (!name) throw new Error("Missing name argument.");
		if (typeof name!=="string") throw new Error("Invalid name argument");
		this[$NAME] = name;

		if (!levels) levels = "*";
		if (typeof levels==="string") {
			if (levels==="*") levels = parent.levels;
			else levels = levels.split(",");
		}
		if (!(levels instanceof Array)) throw new Error("Invalid levels argument");
		this[$LEVELS] = levels.map((level)=>{
			return parent.getLevel(level);
		});

		if (!formatter) throw new Error("Missing formatter argument.");
		if (!(formatter instanceof AbstractLogFormatter)) throw new Error("Invalid formatter argument");
		this[$FORMATTER] = formatter;

		if (!options) throw new Error("Missing options argument.");
		if (!AwesomeUtils.Object.isPlainObject(options)) throw new Error("Invalid options argument");
		this[$OPTIONS] = options;
	}

	/**
	 * Returns the parent AwesomeLog instance.
	 *
	 * @return {AwesomeLog}
	 */
	get parent() {
		return this[$PARENT];
	}

	/**
	 * Returns the type name for this class.
	 *
	 * @return {string}
	 */
	get type() {
		return this[$TYPE];
	}

	/**
	 * Returns the friendly name for the instance of this writer.
	 *
	 * @return {string}
	 */
	get name() {
		return this[$NAME];
	}

	/**
	 * Returns an array of LogLevel objects for the defined levels of this writer. These
	 * are the levels this writer is allowing through.
	 *
	 * @return {Array<LogLevel>}
	 */
	get levels() {
		return this[$LEVELS];
	}

	/**
	 * Returns the formatter associated with this writer.
	 *
	 * @return {AbstractLogFormatter}
	 */
	get formatter() {
		return this[$FORMATTER];
	}

	/**
	 * Returns the Writer option passed in.
	 *
	 * @return {Object}
	 */
	get options() {
		return this[$OPTIONS];
	}

	/**
	 * Returns true of this Writer is processing a given log level.
	 *
	 * @param  {string|LogLevel} level
	 * @return {LogLevel}
	 */
	takesLevel(level) {
		if (!level) throw new Error("Missing level argument.");
		level = this.parent.getLevel(level);
		return this[$LEVELS].indexOf(level)>-1;
	}

	/**
	 * Given some log entry object, format it as per the given formatter.
	 *
	 * @param  {Object} logentry
	 * @return {*}
	 */
	format(logentry) {
		return this.formatter && this.formatter.format && this.formatter.format(logentry) || logentry;
	}

	/**
	 * Expected to be overloaded in the implementing sub-class, this is called when a log message
	 * is to be written out by the writer. Log messages received at this point have already been
	 * checked as to if they are an allowed level and are already formatted as per the defined
	 * formatter.
	 *
	 * The message parameter is the formatted message, returned from calling `format(logentry)`.
	 *
	 * The logentry parameter is the unformated log details.
	 *
	 * @param {*} message
	 * @param {Object} logentry
	 * @return {void}
	 */
	write(/*message,logentry*/) {
		throw new Error("Must be overloaded by subclass.");
	}

	/**
	 * Called to ensure that the writer has written all message out.
	 *
	 * @return {void}
	 */
	flush() {
		throw new Error("Must be overloaded by subclass.");
	}

	/**
	 * Called when the writer is closing and should be cleaned up. No Log messages
	 * will be received after this call has been made.
	 *
	 * @return {void}
	 */
	close() {
		throw new Error("Must be overloaded by subclass.");
	}
}

module.exports = AbstractLogWriter;
