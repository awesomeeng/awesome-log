// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $PARENT = Symbol("type");

class LogFormatter {
	constructor(parent) {
		if (!parent) throw new Error("Missing parent argument.");
		this[$PARENT] = parent;
	}

	get type() {
		return this[$PARENT];
	}

	format(/*logentry*/) {
		throw new Error("Must be overloaded by subclass.");
	}
}

module.exports = LogFormatter;
