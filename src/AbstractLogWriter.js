// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("AwesomeUtils");

const AbstractLogFormatter = require("./AbstractLogFormatter");

const $TYPE = Symbol("type");
const $NAME = Symbol("name");
const $OPTIONS = Symbol("options");
const $LEVELS = Symbol("levels");
const $FORMATTER = Symbol("formatter");
const $PARENT = Symbol("parent");

class AbstractLogWriter {
	constructor(parent,type,name,levels,formatter,options) {
		this[$PARENT] = parent;

		if (!type) throw new Error("Missing type argument.");
		if (typeof type!=="string") throw new Error("Invalid type argument");
		this[$TYPE] = type;

		if (!name) throw new Error("Missing name argument.");
		if (typeof name!=="string") throw new Error("Invalid name argument");
		this[$NAME] = name;

		const Log = require("./AwesomeLog");
		if (!levels) levels = "*";
		if (typeof levels==="string") {
			if (levels==="*") levels = parent.levels;
			else levels = levels.split(",");
		}
		if (!(levels instanceof Array)) throw new Error("Invalid levels argument");
		this[$LEVELS] = levels.map((level)=>{
			return Log.getLevel(level);
		});

		if (!formatter) throw new Error("Missing formatter argument.");
		if (!(formatter instanceof AbstractLogFormatter)) throw new Error("Invalid formatter argument");
		this[$FORMATTER] = formatter;

		if (!options) throw new Error("Missing options argument.");
		if (!AwesomeUtils.Object.isPlainObject(options)) throw new Error("Invalid options argument");
		this[$OPTIONS] = options;
	}

	get parent() {
		return this[$PARENT];
	}

	get type() {
		return this[$TYPE];
	}

	get name() {
		return this[$NAME];
	}

	get levels() {
		return this[$LEVELS];
	}

	get formatter() {
		return this[$FORMATTER];
	}

	get options() {
		return this[$OPTIONS];
	}

	takesLevel(level) {
		if (!level) throw new Error("Missing level argument.");
		level = this.parent.getLevel(level);
		return this[$LEVELS].indexOf(level)>-1;
	}

	format(logentry) {
		return this.formatter && this.formatter.format && this.formatter.format(logentry) || logentry;
	}

	write(/*message,logentry*/) {
		throw new Error("Must be overloaded by subclass.");
	}

	flush() {
		throw new Error("Must be overloaded by subclass.");
	}

	close() {
		throw new Error("Must be overloaded by subclass.");
	}
}

module.exports = AbstractLogWriter;
