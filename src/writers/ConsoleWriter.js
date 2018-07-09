// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const LogWriter = require("../LogWriter");

class ConsoleWriter extends LogWriter {
	constructor(parent,name,levels,formatter,options) {
		super(parent,"Console",name,levels,formatter,options);
	}

	write(message) {
		/*eslint no-console: off */
		console.log(message);
	}

	flush() {
		// intentionally blank
	}

	close() {
		// intentionally blank
	}
}

module.exports = ConsoleWriter;
