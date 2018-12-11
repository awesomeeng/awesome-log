// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const ChildProcess = require("child_process");

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const LogExtensions = require("./LogExtensions");

const $PARENT = Symbol("parent");
const $NAME = Symbol("name");
const $LEVELS = Symbol("levels");
const $TYPE = Symbol("type");
const $OPTIONS = Symbol("options");
const $FORMATTER = Symbol("formatter");
const $FORMATTEROPTIONS = Symbol("formatterOptions");
const $THREAD = Symbol("thread");

class WriterManager {
	constructor(parent,config) {
		config = AwesomeUtils.Object.extend({
			name: null,
			levels: "*",
			type: null,
			options: {},
			formatter: "default",
			formatterOptions: {}
		},config);

		let name = config.name;
		if (!name) throw new Error("Missing name.");
		name = name.replace(/[^\w\d_]/g,""); // strip out any non variables friendly characters.

		let levels = config.levels;
		if (!levels) throw new Error("Missing levels.");
		levels = levels.toLowerCase();
		if (!levels) levels = "*";
		if (typeof levels==="string") {
			if (levels==="*") levels = parent.levels;
			else levels = levels.split(",");
		}
		if (!(levels instanceof Array)) throw new Error("Invalid levels argument");
		this[$LEVELS] = levels.map((level)=>{
			return parent.getLevel(level);
		});

		let type = config.type;
		if (!type) throw new Error("Missing type.");
		type = type.toLowerCase();

		let writerOptions = config.options;

		let formatter = config.formatter;
		if (!formatter) throw new Error("Missing formatter.");
		if (typeof formatter!=="string") throw new Error("Invalid formatter.");

		let formatterOptions = config.formatterOptions;

		this[$PARENT] = parent;
		this[$NAME] = name;
		this[$LEVELS] = levels;
		this[$TYPE] = type;
		this[$OPTIONS] = writerOptions;
		this[$FORMATTER] = formatter;
		this[$FORMATTEROPTIONS] = formatterOptions;
		this[$THREAD] = null;
	}

	get parent() {
		return this[$PARENT];
	}

	get name() {
		return this[$NAME];
	}

	get levels() {
		return this[$LEVELS];
	}

	get type() {
		return this[$TYPE];
	}

	get options() {
		return this[$OPTIONS];
	}

	get formatter() {
		return this[$FORMATTER];
	}

	get formatterOptions() {
		return this[$FORMATTEROPTIONS];
	}

	get running() {
		return !!this[$THREAD];
	}

	/**
	 * Returns true of this Writer is processing a given log level.
	 *
	 * @param  {string|LogLevel} level
	 * @return {LogLevel}
	 */
	takesLevel(level) {
		if (!level) throw new Error("Missing level argument.");
		level = this.parent.getLevel(level);
		return this[$LEVELS].indexOf(level)>-1;
	}

	start() {
		if (this.running) return Promise.resolve(this);

		return new Promise((resolve,reject)=>{
			try {
				let config = {
					name: this.name,
					levels: this.levels,
					writerType: this.type,
					writerPath: LogExtensions.getWriter(this.type),
					writerOptions: this.options,
					formatterType: this.formatter,
					formatterPath: LogExtensions.getFormatter(this.formatter),
					formatterOptions: this.formatterOptions,
				};

				let opts = {
					env: {
						AWESOMELOG_WRITER_CONFIG: JSON.stringify(config),
						NODE_PATH: process.env.NODE_PATH
					}
				};

				let thread = ChildProcess.fork(AwesomeUtils.Module.resolve(module,"./WriterThread"),[],opts);
				thread.on("message",(msg)=>{
					let cmd = msg && msg.cmd || null;
					if (cmd==="AWESOMELOG.WRITER.ERROR") {
						this.stop();
						throw new Error("Writer "+this.name+" had an error: "+msg.details);
					}
					else if (cmd==="AWESOMELOG.WRITER.READY") {
						this[$THREAD] = thread;
						resolve(this);
					}
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	stop() {
		if (!this.running) return Promise.resolve();

		return new Promise((resolve,reject)=>{
			try {
				if (this[$THREAD]) {
					this[$THREAD].once("exit",()=>{
						resolve();
					});
					this[$THREAD].send({
						cmd: "AWESOMELOG.WRITER.CLOSE"
					});
					this[$THREAD] = null;
				}
				else {
					resolve();
				}
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	write(entries) {
		entries = entries.filter((entry)=>{
			return this.takesLevel(entry.level);
		});
		return new Promise((resolve,reject)=>{
			try {
				this[$THREAD].send({
					cmd: "AWESOMELOG.WRITER.ENTRIES",
					entries: entries
				},()=>{
					resolve();
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	flush() {
		if (!this[$THREAD]) return Promise.resolve();

		return new Promise((resolve,reject)=>{
			try {
				let handler = (msg)=>{
					let cmd = msg && msg.cmd || null;
					if (cmd==="AWESOMELOG.WRITER.FLUSHED") {
						this[$THREAD].off("message",handler);
						resolve();
					}
				};
				this[$THREAD].on("message",handler);

				this[$THREAD].send({
					cmd: "AWESOMELOG.WRITER.FLUSH"
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = WriterManager;
