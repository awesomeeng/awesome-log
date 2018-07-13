// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Path = require("path");
const FS = require("fs");

const Lodash = require("lodash");

const LogWriter = require("../LogWriter");

const $FILE = Symbol("file");
const $FILENAME = Symbol("filename");
const $ROOT = Symbol("root");

class FileWriter extends LogWriter {
	constructor(parent,name,levels,formatter,options) {
		options = Lodash.extend({
			filename: "logs/AwesomeLog.{YYYYMMDD}.log",
			rotate: "off"
		},options);

		super(parent,"File",name,levels,formatter,options);

		this[$ROOT] = Path.resolve(process.cwd());
		this[$FILE] = null;
		this[$FILENAME] = null;
	}

	write(message/*,logentry*/) {
		let filename = computeFilename.call(this,this.options.filename);

		if (!this[$FILENAME]) openLogFile.call(this,filename);
		else if (this[$FILENAME]!==filename) {
			closeLogFile(this);
			openLogFile(filename);
		}

		writeLogFile.call(this,message);
	}

	flush() {
		// intentionally blank
	}

	close() {
		closeLogFile.call(this);
	}
}

const computeFilename = function computeFilename(s) {
	if (s.match(/\{[\w\d-._]\}/)) {
		while (true) {
			let match = s.match(/\{[\w\d-._]\}/);
			if (!match) return;

		}
	}
	else {
		if (this[$FILENAME]) return this[$FILENAME];
		return Path.resolve(this[$ROOT],s);
	}
};

const openLogFile = function openLogFile(filename) {
	if (this[$FILENAME]===filename && this[$FILE]) return;
	if (this[$FILE]) closeLogFile.call(this);

	this[$FILENAME] = filename;

	this[$FILE] = FS.createWriteStream(this[$FILENAME],{
		flags: "a",
		encoding: "utf-8"
	});
};

const closeLogFile = function closeLogFile() {
	if (!this[$FILE]) return;

	this[$FILE].end();
	this[$FILE] = null;
};

const writeLogFile = function writeLogFile(entries) {
	if (!entries) return;
	if (!this[$FILE]) return;
	if (typeof entries==="string") entries = [entries];
	entries.forEach((entry)=>{
		this[$FILE].write(entry+"\n","utf-8");
	});
};

module.exports = FileWriter;
