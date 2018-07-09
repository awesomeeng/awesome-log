// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $NAME = Symbol("name");

class LogLevel {
	constructor(name) {
		if (!name) throw new Error("Missing name argument.");
		if (typeof name!=="string") throw new Error("Invalid name argument");
		this[$NAME] = name.toUpperCase();
	}

	get name() {
		return this[$NAME];
	}

	toJSON() {
		return this.name;
	}
}

module.exports = LogLevel;
