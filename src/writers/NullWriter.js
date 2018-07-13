// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const LogWriter = require("../LogWriter");

/**
 * LogWriter to /dev/null
 * 
 * @extends LogWriter
 */
class ConsoleWriter extends LogWriter {
	constructor(parent,name,levels,formatter,options) {
		super(parent,"Null",name,levels,formatter,options);
	}

	write(/*message,logentry*/) {
		// intentionally blank
	}

	flush() {
		// intentionally blank
	}

	close() {
		// intentionally blank
	}
}

module.exports = ConsoleWriter;
