// (c) 2018-2023, The Awesome Engineering Company, https://awesomeeng.com

"use strict";

// External Dependencies
const ChildProcess = require("child_process");
const AwesomeUtils = require("@awesomeeng/awesome-utils");

// Internal Dependencies
const LogExtensions = require("./LogExtensions");

// Setup our symbols for private methods and memebers
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
 * 
 * Internal class for managing a writer. Each writer when created gets a corresponding WriterManagers.
 * Sometime writers are separate processes/thread for performance reasons, 
 * so we needed to break this out with a wrapping manager, this class.
 */
class WriterManager {
	constructor(parent,config,separate=false,noDebugger=true) {
		// Merge the given config with the defaults
		config = AwesomeUtils.Object.extend({
			name: null,
			levels: "*",
			type: null,
			options: {},
			formatter: "default",
			formatterOptions: {}
		},config);

		// validate our name config
		let name = config.name;
		if (!name) throw new Error("Missing name.");
		name = name.replace(/[^\w\d_]/g,""); // strip out any non variables friendly characters.

		// validate our level config
		let levels = config.levels;
		if (!levels) throw new Error("Missing levels.");
		levels = levels.toLowerCase();
		if (!levels) levels = "*";
		if (typeof levels==="string") {
			if (levels==="*") levels = parent.levels;
			else levels = levels.split(",");
		}
		if (!(levels instanceof Array)) throw new Error("Invalid levels argument");
		levels = levels.map((level)=>{
			return parent.getLevel(level);
		});

		// validate our type config
		let type = config.type;
		if (!type) throw new Error("Missing type.");
		type = type.toLowerCase();

		// store our writer options
		let writerOptions = config.options;

		// validate our formatter
		let formatter = config.formatter;
		if (!formatter) throw new Error("Missing formatter.");
		if (typeof formatter!=="string") throw new Error("Invalid formatter.");

		// store our formatter options
		let formatterOptions = config.formatterOptions;

		// set everything
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

	/**
	 * Get the parent, if any
	 */
	get parent() {
		return this[$PARENT];
	}

	/**
	 * Get the writer name.
	 */
	get name() {
		return this[$NAME];
	}

	/**
	 * get the writer levels
	 */
	get levels() {
		return this[$LEVELS];
	}

	/**
	 * Get the writer type.
	 */
	get type() {
		return this[$TYPE];
	}

	/**
	 * get the writer options.
	 */
	get options() {
		return this[$OPTIONS];
	}

	/**
	 * get the formatter.
	 */
	get formatter() {
		return this[$FORMATTER];
	}

	/**
	 * get the formatter options.
	 */
	get formatterOptions() {
		return this[$FORMATTEROPTIONS];
	}

	/**
	 * Return true if this writer has been started.
	 */
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

	/**
	 * Start the writer.
	 */
	start() {
		// If already started, do nothing.
		if (this.running) return Promise.resolve(this);

		// If this is a NULL writer, do nothing.
		if (this[$ISNULL]) return Promise.resolve(this);

		// Return a promise then start the writer
		return new Promise((resolve,reject)=>{
			try {
				// create a configuration of the writer based on what was passed.
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

				// Create the custom write function for this writer.
				this[$WRITEFUNC] = createWriteFunction.call(this);

				// If we are running the writers as separate process/thread (for performance reasons),
				// we set that up here.
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

					// spin up the separate process.
					let thread = ChildProcess.fork(AwesomeUtils.Module.resolve(module,"./WriterThread"),[],opts);

					// listen for messages being sent from the writer thread
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
				// if not a separate process/thread, set up the writer now.
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

	/**
	 * Stop this writer.
	 */
	stop() {
		// If not running, do nothing.
		if (!this.running) return Promise.resolve();

		// If this writer is a NULL writer, do nothing.
		if (this[$ISNULL]) return Promise.resolve(this);

		// REturn a promise, then stop
		return new Promise((resolve,reject)=>{
			try {
				// If this writer is a separate process/thread, stop that.
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
					// otherwise, flush and close this writer.
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

	/**
	 * Write one or more log entries to this writer.
	 */
	write(entries) {
		if (this[$ISNULL]) return Promise.resolve();
		entries = entries.filter((logentry)=>{
			// VM doesnt serialize errors, so
			// we need to do it here.
			if (this[$SEPARATE] && logentry.args) {
				logentry.args = logentry.args.map((arg)=>{
					return formatArg(arg);
				});
			}
			return this.takesLevel(logentry.level);
		});
		return this[$WRITEFUNC](entries,this[$THREAD],this[$WRITER],this[$WRITERFORMATTER]);
	}

	/**
	 * Flush this writer, making sure the write is complete.
	 */
	flush() {
		// If not started, do nothing.
		if (!this[$THREAD]) return Promise.resolve();

		// If this is a NULL writer, do nothing.
		if (this[$ISNULL]) return Promise.resolve();

		// REturn the promise, then flush.
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

/**
 * @private
 * 
 * Internal function to create a write function once, and then reuse it over and over, instead of 
 * using a more generic solution over and over. Holy performance gains batman!
 */
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

/**
 * @private
 * 
 * Internal function for formatting an error argument into something we can serialize.
 */
const formatArg = function formatArg(arg) {
	if (arg instanceof Error) {
		return {
			__TYPE: "error",
			message: arg.message,
			stack: arg.stack,
			cause: formatArg(arg.cause),
		};
	}
	return arg;
};

module.exports = WriterManager;
