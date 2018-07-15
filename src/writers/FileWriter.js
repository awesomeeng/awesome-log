// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Path = require("path");
const FS = require("fs");

const Lodash = require("lodash");
const Moment = require("moment");

const AwesomeUtils  = require("AwesomeUtils");

const LogWriter = require("../LogWriter");

const $FILE = Symbol("file");
const $FILENAME = Symbol("filename");
const $ROOT = Symbol("root");

class FileWriter extends LogWriter {
	constructor(parent,name,levels,formatter,options) {
		options = Lodash.extend({
			filename: "logs/AwesomeLog.{YYYYMMDD}.log",
			housekeeping: false
		},options);

		super(parent,"File",name,levels,formatter,options);

		this[$ROOT] = Path.resolve(process.cwd());
		this[$FILE] = null;
		this[$FILENAME] = null;

		housekeeping.call(this);
	}

	write(message/*,logentry*/) {
		let filename = computeFilename.call(this,this.options.filename);

		if (!this[$FILE] || !this[$FILENAME]) openLogFile.call(this,filename);
		else if (this[$FILENAME]!==filename) {
			closeLogFile.call(this);
			openLogFile.call(this,filename);
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
	if (s.match(/\{[\w\d-._]+\}/)) {
		while (true) {
			let match = s.match(/\{([\w\d-._]+)\}/);
			if (!match) break;

			let start = match.index;
			let end = match.index+match[0].length;
			let format = match[1];
			let replacement = Moment(Date.now()).utc().format(format);
			s = s.slice(0,start)+replacement+s.slice(end);
		}
	}
	else if (this[$FILENAME]) return this[$FILENAME];
	return Path.resolve(this[$ROOT],s);
};

const openLogFile = function openLogFile(filename) {
	if (this[$FILENAME]===filename && this[$FILE]) return;
	if (this[$FILE]) closeLogFile.call(this);

	this[$FILENAME] = filename;

	let dir = Path.dirname(this[$FILENAME]);
	if (!AwesomeUtils.FS.existsSync(dir)) FS.mkdirSync(dir);

	this[$FILE] = FS.openSync(this[$FILENAME],"a");
};

const closeLogFile = function closeLogFile() {
	if (!this[$FILE]) return;

	FS.closeSync(this[$FILE]);
	this[$FILE] = null;

	housekeeping.call(this);
};

const writeLogFile = function writeLogFile(entries) {
	if (!entries) return;
	if (!this[$FILE]) return;
	if (typeof entries==="string") entries = [entries];

	let s = entries.join("\n")+"\n";
	FS.writeSync(this[$FILE],s,0,"utf-8");
};

const housekeeping = function housekeeping() {
	if (!this.options.housekeeping) return;
	if (!this.options.filename.match(/\{[\w\d-._]+\}/)) return;

	let duration = AwesomeUtils.Date.duration(this.options.housekeeping);
	let path = Path.resolve(this[$ROOT],this.options.filename);

	let dir = Path.dirname(path);
	if (!AwesomeUtils.FS.existsSync(dir)) return;

	let filename = Path.basename(path);
	filename = filename.split(/\{[\w\d-._]+\}/g);
	filename = filename.map((filename)=>{
		return filename.replace(/\./g,"\\.");
	});
	filename = filename.join("(.+?)");
	let matcher = new RegExp("^"+filename+"$");

	let files = FS.readdirSync(dir);
	files.forEach((file)=>{
		if (file===this[$FILENAME]) return;

		let match = matcher.exec(file);
		if (!match) return;

		let dates = [...match];
		dates.shift();

		let old = dates.every((date)=>{
			if (!date) return;

			date = AwesomeUtils.Date.from(date);
			if (!date) return;
			date = date.getTime();

			let passed = Moment().utc().subtract(date).millisecond();
			return (passed>duration);
		});

		if (old) {
			FS.unlinkSync(file);
		}
	});
};

module.exports = FileWriter;
