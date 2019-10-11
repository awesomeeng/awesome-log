// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const ChildProcess = require("child_process");

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const LogExtensions = require("./LogExtensions");

const $PARENT = Symbol("parent");
const $SEPARATE = Symbol("separate");
const $NAME = Symbol("name");
const $LEVELS = Symbol("levels");
const $TYPE = Symbol("type");
const $OPTIONS = Symbol("options");
const $FORMATTER = Symbol("formatter");
const $FORMATTEROPTIONS = Symbol("formatterOptions");
const $THREAD = Symbol("thread");
const $ISNULL = Symbol("isNullWriter");
const $WRITER = Symbol("writer");
const $WRITERFORMATTER = Symbol("writerFormatter");
const $WRITEFUNC = Symbol("writeFunction");
const $NODEBUGGER = Symbol("noDebugger");

/**
 * @private
 */
class WriterManager {
	constructor(parent,config,separate=false,noDebugger=true) {
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
		this[$SEPARATE] = separate;
		this[$NODEBUGGER] = noDebugger;
		this[$NAME] = name;
		this[$LEVELS] = levels;
		this[$TYPE] = type;
		this[$OPTIONS] = writerOptions;
		this[$FORMATTER] = formatter;
		this[$FORMATTEROPTIONS] = formatterOptions;
		this[$THREAD] = null;
		this[$ISNULL] = type==="null";
		this[$WRITER] = null;
		this[$WRITERFORMATTER] = null;
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
		return !!((this[$SEPARATE] && this[$THREAD]) || (!this[$SEPARATE] && this[$WRITER]));
	}

	/**
	 * Returns true of this Writer is processing a given log level.
	 *
	 * @param  {string|LogLevel} level
	 * @return {LogLevel}
	 */
	takesLevel(level) {
		if (!level) return false;
		level = this.parent.getLevel(level);
		return this[$LEVELS].indexOf(level)>-1;
	}

	start() {
		if (this.running) return Promise.resolve(this);

		if (this[$ISNULL]) return Promise.resolve(this);

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

				this[$WRITEFUNC] = createWriteFunction.call(this);

				if (this[$SEPARATE]) {
					let opts = {
						env: {
							AWESOMELOG_WRITER_CONFIG: JSON.stringify(config),
							NODE_PATH: process.env.NODE_PATH
						},
						execArgv: this[$NODEBUGGER] && process.execArgv.filter((a)=>{
							return !(a.match(/^--debug|^--inspect/g));
						}) || process.execArgv
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
				else {
					try {
						this[$WRITERFORMATTER] = new (require(config.formatterPath))(config.formatterOptions);
					}
					catch (ex) {
						this.sendError("Error initializing formatter at "+config.formatterPath+".");
						this.stop(1);
					}

					try {
						this[$WRITER] = new (require(config.writerPath))(config.writerOptions);
					}
					catch (ex) {
						this.sendError("Error initializing writer at "+config.writerPath+".");
						this.stop(1);
					}

					resolve(this);
				}
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	stop() {
		if (!this.running) return Promise.resolve();

		if (this[$ISNULL]) return Promise.resolve(this);

		return new Promise((resolve,reject)=>{
			try {
				if (this[$SEPARATE]) {
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
				else {
					if (this[$WRITER]) {
						this[$WRITER].flush();
						this[$WRITER].close();
						this[$WRITER] = null;
					}

					this[$WRITERFORMATTER] = null;

					resolve();
				}
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	write(entries) {
		if (this[$ISNULL]) return Promise.resolve();
		entries = entries.filter((logentry)=>{
			// VM doesnt serialize errors, so
			// we need to do it here.
			if (logentry.args) {
				logentry.args = logentry.args.map((arg)=>{
					if (arg instanceof Error) {
						return {
							__TYPE: "error",
							message: arg.message,
							stack: arg.stack
						};
					}
					return arg;
				});
			}
			return this.takesLevel(logentry.level);
		});
		return this[$WRITEFUNC](entries,this[$THREAD],this[$WRITER],this[$WRITERFORMATTER]);
	}

	flush() {
		if (!this[$THREAD]) return Promise.resolve();

		if (this[$ISNULL]) return Promise.resolve();

		return new Promise((resolve,reject)=>{
			try {
				if (this[$SEPARATE]) {
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
				else {
					this[$WRITER].flush();
				}
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

const createWriteFunction = function createWriteFunction() {
	let f = "const entries = arguments[0];";
	if (this[$SEPARATE]) {
		f += "const thread = arguments[1];";
		f += "return new Promise((resolve,reject)=>{";
		f += "try {";
		f += "thread.send(entries,()=>{";
		f += "resolve();";
		f += "});";
	}
	else {
		f += "const writer = arguments[2];";
		f += "const formatter = arguments[3];";
		f += "return new Promise((resolve,reject)=>{";
		f += "try {";
		f += "entries.forEach((logentry)=>{";
		f += "let msg = formatter.format(logentry);";
		f += "writer.write(msg,logentry);";
		f += "});";
		f += "resolve();";
	}
	f += "}";
	f += "catch (ex) {";
	f += "return reject(ex);";
	f += "}";
	f += "});";

	return new Function(f);
};

module.exports = WriterManager;
