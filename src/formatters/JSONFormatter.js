// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");
const AbstractLogFormatter = require("../AbstractLogFormatter");

/**
 * The JSON AwesomeLog formatter. This produces log message in JSON form. This
 * will include all of the details in a log entry Object.
 * 
 * The JSON formatter supports the following formatter options:
 * 
 * 		formatterOptions = {
 * 			alias: {},
 * 			move: {},
 * 			oneline: false,
 * 			allowCircularReferenceErrors: true
 *  	}
 * 
 * 		alias - An object that allows you to alias log entry data under a different key. That is
 * 				you create a copy from one logentry key into a new logentry key. You must supply
 * 				the new key as the key in the object, and to origin key as the value. You may
 * 				not overwrite an existing logentry key.
 * 
 * 				alias: {
 * 					lastname: "name"
 * 				}
 * 
 * 				would create a new property of logentry.lastname with the value of whatever is in logentry.name.
 * 
 * 		move - Similar to alias, except this will remove the original key from logentry after moving the value.
 * 			   All the same rules fro alias apply.
 * 
 * 		oneline - This will ensure that the logentry.text value includes the logentry.args values in a single line
 * 				  of text. This is similar to the Default formatter's oneline formatter option.
 * 
 * 		allowCircularReferenceErrors -   If during the process of converting a log message to a json string
 * 									     the JSON.stringify method encounters a circular reference it will
 * 										 just keep delving into the circular object until it exceeds the
 * 										 call stack maximum and throw an error, potentially leaving awesome log in
 * 										 a bad way. So you can set this to `true` and whenever awesomelog
 * 										 encounters this behavior it will strip the args object out of the log
 * 										 entry since that is where these circular references are likely to occur.
 * 										 This option is enabled by default as of v4.7.0, but we wanted to give
 * 										 the option to disable it by setting this to `false`. It is `true` by default.
 *
 * @extends AbstractLogFormatter
 */
class JSONFormatter extends AbstractLogFormatter {
	/**
	 * @private
	 *
	 * Constructor for this formatter. Never called directly, but called by AwesomeLog
	 * when `Log.start()` is called.
	 *
	 * @param {Object} options
	 */
	constructor(options) {
		super(AwesomeUtils.Object.extend({
			alias: {},
			move: {},
			oneline: false,
			allowCircularReferenceErrors: true,
		},options));
	}

	/**
	 * @private
	 *
	 * Given the log entry object, format it tou our output string.
	 *
	 * @param  {Object} logentry
	 * @return {*}
	 */
	format(logentry) {
		if (logentry.args) logentry.args = logentry.args.map(formatArg.bind(this));

		if (this.options.alias || this.options.move || this.options.oneline) {
			logentry = this.remap(logentry);
			logentry = this.onelineMessage(logentry);
		}

		try {
			return JSON.stringify(logentry);
		} catch (err) {
			// if json parsing fails, its probably a circular reference
			// which can be very bad for performance and leave AwesomeLog in a bad
			// state. So if we get here, we fix it silently and mutate the log message.
			if (!this.options.allowCircularReferenceErrors) throw err;

			Object.keys(logentry).forEach((key)=>{
				const value = logentry[key];
				try {
					JSON.stringify(value);
				} catch (ex) {
					logentry[key] = "<JSON Parse Error: An error parsing this object into JSON occurred and AwesomeLog has removed it>";
					if (key==="args") logentry[key] = [logentry[key]];
				}
			});

			return JSON.stringify(logentry);
		}
	}

	remap(logentry) {
		Object.keys(this.options.alias || {}).forEach(to => {
			const from = this.options.alias[to];
			if (!from || typeof from !== 'string') return;
			if (logentry[to]!==undefined) return;
			logentry[to] = logentry[from];
		});

		Object.keys(this.options.move || {}).forEach(to => {
			const from = this.options.move[to];
			if (!from || typeof from !== 'string') return;
			if (logentry[to]!==undefined) return;
			logentry[to] = logentry[from];
			delete logentry[from];
		});

		return logentry;
	}

	onelineMessage(logentry) {
		if (this.options.oneline === true) {
			let args = logentry.args && [].concat(logentry.args) || null;
			if (args.length>0) {
				args = args.map(arg => {
					if (arg instanceof Error) {
						return arg.stack && arg.stack.split(/\n[\t\s]*/).join(" ") || arg.message || ""+arg;
					}
					else if (arg instanceof Array || AwesomeUtils.Object.isPlainObject(arg)) {
						return JSON.stringify(arg);
					}
					else {
						return ""+arg;
					}						
				});

				logentry.text += " : ";
				logentry.text += "[ "+args.join(" | ")+" ]";
			}
		}
		
		return logentry;
	}
}

const formatArg = function formatArg(arg) {
	if (arg instanceof Error) {
		arg = {
			__TYPE: "error",
			message: arg.message,
			stack: arg.stack
		};
	}
	return arg;
};

module.exports = JSONFormatter;
