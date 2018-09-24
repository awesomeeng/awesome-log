// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $PARENT = Symbol("parent");

/**
 * Describes the shape of a Log Formatter. This class is expected to be extend for all
 * Log Formatter implementations. After this class is extended, you pass the extending
 * class into `AwesomeLog.defineLogFormatter(name,class)` to add your Log Formatter to
 * AwesomeLog for usage.
 *
 * @see {@link ./docs/LogFormatters.md Log Writer} documentation for more details.
 *
 * @interface
 */
class AbstractLogFormatter {
	/**
	* Constructor for a Log Formatter.
	*
	* It is important to note that this constructor is never called by you, but
	* is instead called by AwesomeLog when the `start()` command is issued.
	*
	* Your class must call this as shown here:
	*
	* ```
	* class MyFormatter extends AbstractLogFormatter {
	* 	 constructor(parent) {
	* 	   super(parent);
	*
	* 	   ... your initialization code ...
	* 	 }
	* }
	* ```
	*
	* Failure to not do the super constructor will result in errors.
	*
	* You should put any kind of initialization of your formatter in this constructor.
	*
	 * @param {AwesomeLog} parent
	 */
	constructor(parent) {
		if (!parent) throw new Error("Missing parent argument.");
		this[$PARENT] = parent;
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
	 * Called when a logentry needs to be formatted.  The underlying writer will call this for
	 * each log message it needs to write out.
	 *
	 * @return {Object}
	 */
	format(/*logentry*/) {
		throw new Error("Must be overloaded by subclass.");
	}
}

module.exports = AbstractLogFormatter;
