// (c) 2018-2023, The Awesome Engineering Company, https://awesomeeng.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const $OPTIONS = Symbol("options");

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
	 * 	 constructor(options) {
	 * 	   super(options);
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
	 * @param {Object} options
	 */
	constructor(options={}) {
		if (!options) throw new Error("Missing options argument.");
		if (!AwesomeUtils.Object.isPlainObject(options)) throw new Error("Invalid options argument");
		this[$OPTIONS] = options;
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
