// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Path = require("path");
const FS = require("fs");

const AwesomeUtils  = require("@awesomeeng/awesome-utils");

const AbstractLogWriter = require("../AbstractLogWriter");

const $FILE = Symbol("file");
const $FILENAME = Symbol("filename");
const $ROOT = Symbol("root");

/**
 * A writer for outputing to a specific file or file pattern.
 *
 * If you give a simple filename, the log will be written to that filename
 * indefinately, appending each time. This is fine for simple systems.
 *
 * For more complex systems you will want to provide a filename pattern
 * which looks something like this `logs/NyLog.{YYYYMMDD}.log` which will change
 * the file written to based on the current date, in this case the Year Month Day
 * pattern.
 *
 * @see Our {@link ./docs/FileWriterConfiguration.md File Writer Configuration}
 * documentation for more details.
 *
 * @extends AbstractLogWriter
 */
class FileWriter extends AbstractLogWriter {
	/**
	 * Creates a new File Writer. Never called directly, but AwesomeLog
	 * will call this when `AwesomeLog.start()` is issued.
	 *
	 * The options parameters can be used to configure this Console Writer.
	 * Here are the default configuration values:
	 *
	 * ```
	 * options = {
	 *   filename: "logs/AwesomeLog.{YYYYMMDD}.log",
	 *   housekeeping: false
	 * }
	 * ```
	 *
	 * Housekeeping can be `false` or a number representing a number of
	 * milliseconds after which a file is considered old.  Old files are
	 * deleted by the system.
	 *
	 * @param {AwesomeLog} parent
	 * @param {string} name
	 * @param {string} levels
	 * @param {AbstractLogFormatter} formatter
	 * @param {Object} options
	 */
	constructor(parent,name,levels,formatter,options) {
		options = AwesomeUtils.Object.extend({
			filename: "logs/AwesomeLog.{YYYYMMDD}.log",
			housekeeping: false
		},options);

		super(parent,"File",name,levels,formatter,options);

		this[$ROOT] = Path.dirname(Path.resolve(process.cwd(),options.filename)).replace(/\\|\\\\/g,"/");
		while (this[$ROOT].match(/\{[^}]+\}/g)) this[$ROOT] = Path.dirname(this[$ROOT]);

		this[$FILE] = null;
		this[$FILENAME] = null;

		housekeeping.call(this);
	}

	/**
	 * Write a log message to the log file.
	 *
	 * @param {*} message
	 * @param {Object} logentry
	 * @return {void}
	 */
	write(message/*,logentry*/) {
		message = ""+message;
		let filename = computeFilename.call(this,this.options.filename);

		if (!this[$FILE] || !this[$FILENAME]) openLogFile.call(this,filename);
		else if (this[$FILENAME]!==filename) {
			closeLogFile.call(this);
			openLogFile.call(this,filename);
		}

		writeLogFile.call(this,message);
	}

	/**
	 * Flush the pending writes. This has not effect in this case.
	 *
	 * @return {void}
	 */
	flush() {
		// intentionally blank
	}

	/**
	 * Close the file.
	 *
	 * @return {void}
	 */
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
			let replacement = AwesomeUtils.Date.format(Date.now(),format);
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
	if (!AwesomeUtils.FS.existsSync(dir)) AwesomeUtils.FS.recursiveMkdirSync(dir);

	this[$FILE] = FS.openSync(this[$FILENAME],"a");
};

const closeLogFile = function closeLogFile() {
	if (!this[$FILE]) return;

	FS.closeSync(this[$FILE]);
	this[$FILE] = null;
	this[$FILENAME] = null;

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

	let duration = Math.max(100,Math.min(9999999999,this.options.housekeeping||60000));

	let dir = this[$ROOT];
	if (!AwesomeUtils.FS.existsSync(dir)) return;

	let filename = this.options.filename.replace(/\\|\\\\/g,"/");
	filename = filename.split(/\{[\w\d-._]+\}/g);
	filename = filename.map((filename)=>{
		return filename.replace(/\./g,"\\.");
	});
	filename = filename.join("(.+?)");
	let matcher = new RegExp("^"+filename+"$");

	let files = AwesomeUtils.FS.recursiveListSync(dir);
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

			let passed = Date.now()-date;
			return (passed>duration);
		});

		if (old) {
			try {
				FS.unlinkSync(file);
			}
			catch (ex) {
				if (!ex.message.startsWith("ENOENT")) throw ex;
			}
		}
	});
};

module.exports = FileWriter;
