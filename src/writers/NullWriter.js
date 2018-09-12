// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractLogWriter = require("../AbstractLogWriter");

/**
 * AbstractLogWriter to /dev/null
 *
 * @extends AbstractLogWriter
 */
class NullWriter extends AbstractLogWriter {
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

module.exports = NullWriter;
