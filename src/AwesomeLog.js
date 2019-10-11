// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");
const Process = require("process");

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const LogLevel = require("./LogLevel");
const LogExtensions = require("./LogExtensions");
const WriterManager = require("./WriterManager");
const AbstractLogWriter = require("./AbstractLogWriter");
const AbstractLogFormatter = require("./AbstractLogFormatter");

let Worker;
try {
	Worker = require('worker_threads');
}
catch (ex) {
	Worker = null;
}

const $CONFIG = Symbol("config");
const $BACKLOG = Symbol("backlog");
const $HISTORY = Symbol("history");
const $HISTORYFORMATTER = Symbol("historyFormatter");
const $FUNCTIONS = Symbol("functions");
const $LEVELS = Symbol("levels");
const $WRITERS = Symbol("writers");
const $RUNNING = Symbol("running");
const $SUBPROCESSES = Symbol("subprocesshandler");
const $STARTS = Symbol("starts");
const $BUFFER = Symbol("buffer");
const $DRAINSCHEDULED = Symbol("drainScheduled");
const $FIELDSFUNC = Symbol("fieldsFunction");
const $WRITEFUNC = Symbol("writeFunction");
const $ISSUBPROCESS = Symbol("isSubprocess");
const $STARTPENDING = Symbol("startPending");

/**
 * AwesomeLog is a singleton object returned when you
 * `const Log = require("@awesomeeng/awesome-log")`. From it you
 * can initialize and start your log service and then begin writing
 * log messages out. Please see our
 * {@link ../README.md extensive documentation} for usage details.
 */
class AwesomeLog {
	constructor() {
		this[$CONFIG] = null;
		this[$BACKLOG] = [];
		this[$HISTORY] = [];
		this[$FUNCTIONS] = {};
		this[$LEVELS] = [];
		this[$WRITERS] = [];
		this[$RUNNING] = false;
		this[$SUBPROCESSES] = new Map();
		this[$STARTS] = 0;
		this[$BUFFER] = new Array(1000).fill(null);
		this[$BUFFER].length = 0;
		this[$DRAINSCHEDULED] = false;
		this[$FIELDSFUNC] = (obj)=>{
			return obj;
		};
		this[$WRITEFUNC] = ()=>{};
		this[$ISSUBPROCESS] = !!Process.channel || Worker && Worker.parentPort && Worker.parentPort.postMessage || false;
		this[$STARTPENDING] = false;

		initLevels.call(this,"access,error,warn,info,debug");
	}

	/**
	 * Returns the AbstractLogWriter class for use in creating custom Log Writers.
	 *
	 * @return {Class<AbstractLogWriter>}
	 */
	get AbstractLogWriter() {
		return AbstractLogWriter;
	}

	/**
	 * Returns the AbstractLogFormatter class for use in creating custom Log Formatters.
	 *
	 * @return {Class<AbstractLogFormatter>}
	 */
	get AbstractLogFormatter() {
		return AbstractLogFormatter;
	}

	/**
	 * Returns true if `Log.init()` has been called.
	 *
	 * @return {boolean}
	 */
	get initialized() {
		return this[$CONFIG]!==null;
	}

	/**
	 * Returns true if `Log.start()` has been called.
	 *
	 * @return {boolean}
	 */
	get running() {
		return this[$RUNNING];
	}

	/**
	 * Returns the configuration used by `init()`. This is a merge of the default configuration
	 * and the configuration passed into `init()`.
	 *
	 * @return {Object}
	 */
	get config() {
		return AwesomeUtils.Object.extend({},this[$CONFIG]);
	}

	/**
	 * Returns an array of the last N (defined by `historySizeLimit`) log messages.
	 *
	 * @return {Array}
	 */
	get history() {
		return (this[$HISTORY]||[]).slice();
	}

	/**
	 * Returns the maximum number of `history` entries. This is set via `init()`.
	 *
	 * @return {number}
	 */
	get historySizeLimit() {
		return this[$CONFIG].historySizeLimit;
	}

	/**
	 * Returns an array of LogLevel objects for the currently configured levels. Levels
	 * are configured via `init()`.
	 *
	 * @return {Array<LogLevel>}
	 */
	get levels() {
		return this[$LEVELS];
	}

	/**
	 * Returns an array of strings containing the level names, as taken from the LogLevel
	 * objects. Levels are configured via `init()`.
	 *
	 * @return {Array<string>}
	 */
	get levelNames() {
		return this[$LEVELS].map((level)=>{
			return level.name;
		});
	}

	/**
	* Map a new Log Writer to a specific filename, for usage in configuring AwesomeLog.
	* The filename given must export a class that extends AbstractLogWriter.
	 *
	 * @param  {string} name
	 * @param  {string} filename
	 * @return {void}
	 */
	defineWriter(name,filename) {
		return LogExtensions.defineWriter(name,filename);
	}

	/**
	* Map a new Log Formatter to a specific filename, for usage in configuring AwesomeLog.
	* The filename given must export a class that extends AbstractLogFormatter.
	*
	* @param  {string} name
	* @param  {string} filename
	* @return {void}
	*/
	defineFormatter(name,filename) {
		return LogExtensions.defineFormatter(name,filename);
	}

	/**
	 * Initializes AwesomeLog for usage. This should be called very early in your application,
	 * in the entry point if possible.
	 *
	 * You may only initialize if AwesomeLog is not running, which is done by calling
	 * `start()`, so do this before `start()`.
	 *
	 * This method takes an optional configuration object. This configuration object is merged
	 * with the default configuration to produce the overall configuration.  Below is the
	 * default configuration values:
	 *
	 * ```
	 * config = {
	 *   buffering: false,
	 *   separate: true,
	 *   history: true,
	 *   historySizeLimit: 100,
	 *   historyFormatter: "default",
	 *   levels: "access,error,warn,info,debug",
	 *   disableLoggingNotices: false, // true if this is a child process
	 *   loggingNoticesLevel: "info",
	 *   fields: "timestamp,pid,system,level,text,args",
	 *   writers: [],
	 *   backlogSizeLimit: 1000,
	 *   disableSubProcesses: false,
	 *   scopeMap: null,
	 *   scopeCatchAll: "info"
	 * }
	 * ```
	 *
	 * If no writers are provided, a default Console Writer is added to the configuration.
	 *
	 * ```
	 * config.writers = [{
	 *  type:  "default", // "subprocess" if this is a child process
	 *  levels: "*",
	 *  formatter: default", // "subprocess" if this is a child process
	 *  options: {}
	 * }];
	 * ```
	 *
	 * Initialization is responsible for taking the `config.levels` parameters,
	 * transforming it into LogLevel objects, and ensuring that the log shortcut
	 * methods are created. See also @see ./docs/LogLevels.md
	 *
	 * @param  {Object|null} config
	 * @return {void}
	 */
	init(config) {
		let disableSP = config && config.disableSubProcesses || false;
		config = AwesomeUtils.Object.extend({
			separate: true,
			buffering: false,
			history: true,
			historySizeLimit: 100,
			historyFormatter: "default",
			historyFormatterOptions: {},
			levels: "access,error,warn,info,debug",
			disableLoggingNotices: !disableSP && this[$ISSUBPROCESS] ? true : false,
			loggingNoticesLevel: "info",
			fields: "timestamp,pid,system,level,text,args",
			writers: [],
			backlogSizeLimit: 1000,
			disableSubProcesses: false,
			scopeMap: null,
			scopeCatchAll: "info"
		},config||{});
		disableSP = config.disableSubProcesses;

		if (!this.initialized) {
			if (config.writers.length<1) config.writers.push({
				name: "DefaultWriter",
				type:  !disableSP && this[$ISSUBPROCESS] ? "null" : "default",
				levels: "*",
				formatter: !disableSP && this[$ISSUBPROCESS] ? "jsobject" : "default",
				options: {}
			});

			initLevels.call(this,config.levels);
			if (!this.getLevel(config.loggingNoticesLevel)) config.loggingNoticesLevel = this.levels.slice(-1)[0] && this.levels.slice(-1)[0].name || null;

			let histformpath = LogExtensions.getFormatter(config.historyFormatter);
			if (!histformpath) throw new Error("Invalid history formatter.");
			if (!AwesomeUtils.FS.existsSync(histformpath)) throw new Error("Formatter not found at "+histformpath+".");
			this[$HISTORYFORMATTER] = new (require(histformpath))(config.historyFormatterOptions||{});

			this[$CONFIG] = config;

			// these must come after this[$CONFIG] is set.
			this[$FIELDSFUNC] = createFieldsFunction.call(this,config.fields);
			this[$WRITEFUNC] = createWriteFunction.call(this);

			// these must come after this[$CONFIG] is set.
			if (!config.disableLoggingNotices) this.log(config.loggingNoticesLevel,"AwesomeLog initialized for levels "+this.levelNames.join("|")+".");
		}
		else {
			mapLevels.call(this,config.levels);

			if (!this.config.disableLoggingNotices) this.log(this.config.loggingNoticesLevel,"AwesomeLog mapped levels from dependant module "+config.levels+".");
		}

		return this;
	}

	/**
	 * Starts AwesomeLog running and outputting log messages. This should be called
	 * very early in your application, in the entry point if possible.
	 *
	 * `start()` is responsible for initializing the writers.
	 *
	 * If any backlog messages exist when `start()` is called, they will be written
	 * via the writers after they are started.
	 *
	 * `start()` returns a promise, which allows it to be awaited using async/await.
	 * It is okay not to await for start to complete. AwesomeLog will still capture
	 * any log writes in its backlog and write them when `start()` is complete.
	 *
	 * @return {void}
	 */
	start() {
		this[$STARTS] += 1;

		if (this.running) return Promise.resolve(this);

		if (this[$CONFIG]===null) this.init();

		this[$STARTPENDING] = true;
		this[$RUNNING] = true;
		this[$HISTORY] = [];

		if (!this.config.disableLoggingNotices) this.log(this.config.loggingNoticesLevel,"AwesomeLog started.");

		return new Promise(async (resolve,reject)=>{
			try {
				await initWriters.call(this);

				[...this[$SUBPROCESSES].keys()].forEach((subprocess)=>{
					this[$SUBPROCESSES].delete(subprocess);
					this.captureSubProcess(subprocess);
				});

				if (this[$BACKLOG]) {
					this[$BACKLOG].forEach((logentry)=>{
						write.call(this,logentry);
					});
				}
				this[$BACKLOG] = null;

				this[$STARTPENDING] = false;
				resolve(this);
			}
			catch (ex) {
				this[$STARTPENDING] = false;
				this[$RUNNING] = false;
				return reject(ex);
			}
		});
	}

	/**
	 * Stops AwesomeLog running. Once stopped AwesomeLog can be reconfigured via another
	 * `init()` call.
	 *
	 * `stop()` returns a promise, which allows it to be awaited using async/await.
	 * Generally it is okay to not await for `stop()` to complete.
	 *
	 * @return {void}
	 */
	stop() {
		if (!this.running || this[$STARTS]>1) return Promise.resolve(this);

		return new Promise((resolve,reject)=>{
			try {
				let check = async ()=>{
					if (!this[$STARTPENDING]) {
						await stop();
						resolve(this);
						return;
					}
					setImmediate(check);
				};

				let stop = ()=>{
					this[$STARTS] -= 1;

					this[$BACKLOG] = this[$BACKLOG] || [];
					this[$RUNNING] = false;

					if (!this.config.disableLoggingNotices) this.log(this.config.loggingNoticesLevel,"AwesomeLog stopped.");

					return new Promise(async (resolve,reject)=>{
						try {
							[...this[$SUBPROCESSES].keys()].forEach((subprocess)=>{
								this.releaseSubProcess(subprocess);
								this[$SUBPROCESSES].set(subprocess,null);
							});

							await Promise.all(this[$WRITERS].map((writer)=>{
								return writer.stop(0);
							}));

							resolve(this);
						}
						catch (ex) {
							return reject(ex);
						}
					});
				};

				check();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	/**
	 * Puts AwesomeLog into a paused state which prevents any log messages from being
	 * written by the writers.  Log messages received while paused are stored in the
	 * backlog and will be written when AwesomeLog is resumed.
	 *
	 * @return {void}
	 */
	pause() {
		if (!this.running) return;
		this[$BACKLOG] = this[$BACKLOG] || [];

		if (!this.config.disableLoggingNotices) this.log(this.config.loggingNoticesLevel,"AwesomeLog paused.");

		return this;
	}

	/**
	 * Exits the paused state and writes out any backlog messages.
	 *
	 * @return {void}
	 */
	resume() {
		if (!this.running) return;

		if (this[$BACKLOG]) {
			this[$BACKLOG].forEach((logentry)=>{
				write.call(this,logentry);
			});
		}
		this[$BACKLOG] = null;

		if (!this.config.disableLoggingNotices) this.log(this.config.loggingNoticesLevel,"AwesomeLog resumed.");

		return this;
	}

	/**
	 * Clears the stored `history` contents.
	 *
	 * @return {AwesomeLog}
	 */
	clearHistory() {
		this[$HISTORY] = [];

		return this;
	}

	/**
	 * For any given level string, return the associated LogLevel object.
	 *
	 * @param  {string|LogLevel} level
	 * @return {LogLevel}
	 */
	getLevel(level) {
		if (!level) throw new Error("Missing level argument.");
		if (level instanceof LogLevel) return level;
		if (typeof level==="string") {
			level = level.toUpperCase();
			let index = this[$LEVELS].reduce((index,x,i)=>{
				if (index>-1) return index;
				if (x && x.name && x.name===level) return i;
				return -1;
			},-1);
			return index>-1 && this[$LEVELS][index] || null;
		}
		throw new Error("Invalid level argument.");
	}

	/**
	 * Log a single messages.
	 *
	 * `log()` is called by all other shortcut log methods.
	 *
	 * @param  {string|LogLevel} level
	 * @param  {string} text
	 * @param  {*} args
	 * @return {AwesomeLog}
	 */
	log(level,text,...args) {
		let logentry = null;

		if (!text && level && typeof level==="object") {
			logentry = level;
			text = logentry.text||"";
			args = logentry.args||[];
			level = logentry.level||"";
		}
		if (typeof text==="object" && !(text instanceof Error)) {
			logentry = text;
			text = logentry.text||"";
			args = logentry.args||[];
			level =logentry.level||level||"";
		}
		if (text instanceof Error) {
			args.unshift(text);
			text = text.message;
		}

		level = this.getLevel(level).name;

		logentry = this[$FIELDSFUNC](logentry||{},level,text,args);


		if (this[$BACKLOG]) {
			this[$BACKLOG].push(logentry);
			if (this[$BACKLOG].length>this.config.backlogSizeLimit) this[$BACKLOG].shift();
		}
		else if (this[$ISSUBPROCESS] && !this.config.disableSubProcesses) {
			if (AwesomeUtils.Workers.enabled && AwesomeUtils.Workers.Workers && AwesomeUtils.Workers.Workers.parentPort) {
				AwesomeUtils.Workers.Workers.parentPort.postMessage({
					cmd: "AWESOMELOG.ENTRY",
					logentry
				});
			}
			else {
				process.send({
					cmd: "AWESOMELOG.ENTRY",
					logentry
				});
			}
		}
		else {
			write.call(this,logentry);
		}
	}

	/**
	 * Used when you create a new child process/cluster/worker thread if you intend AwesomeLog
	 * to be used in the process/cluster/worker and want the log information consolidated
	 * into a single AwesomeLog stream.
	 * @see ./docs/ChildProcess.md
	 *
	 * @param  {ChildProcess.ChildProcess|Cluster.Worker|WorkerThread.Worker} subprocess
	 * @return {AwesomeLog}
	 */
	captureSubProcess(subprocess) {
		if (!subprocess) return;
		if (!subprocess.on) return;
		if (this[$SUBPROCESSES].has(subprocess)) return;

		this[$SUBPROCESSES].set(subprocess,subProcessHandler.bind(this));
		subprocess.on("message",this[$SUBPROCESSES].get(subprocess));

		return this;
	}

	/**
	 * Stops capturing a process/cluster/worker log messages.
	 * @see ./docs/ChildProcess.md
	 *
	 * @param  {ChildProcess.ChildProcess|Cluster.Worker|WorkerThread.Worker} subprocess
	 * @return {AwesomeLog}
	 */
	releaseSubProcess(subprocess) {
		if (!subprocess) return;
		if (!subprocess.off) return;
		if (!this[$SUBPROCESSES].has(subprocess)) return;

		subprocess.off("message",this[$SUBPROCESSES].get(subprocess));
		this[$SUBPROCESSES].delete(subprocess);

		return this;
	}
}

const initLevels = function initLevels(levels) {
	// If we have pre-existing levels, remove the functions...
	this[$LEVELS].forEach((level)=>{
		delete this[level.name.toLowerCase()];
		delete this[level.name.toUpperCase()];
		delete this[level.name.slice(0,1).toUpperCase()+level.name.slice(1).toLowerCase()];
	});

	this[$LEVELS] = [];

	let configlevels = levels;
	if (!configlevels) throw new Error("No levels configured.");
	if (typeof configlevels==="string") configlevels = configlevels.split(",");
	if (!(configlevels instanceof Array)) throw new Error("Invalid levels configured.");

	// build our levels array.
	configlevels = AwesomeUtils.Array.compact(configlevels.map((level)=>{
		if (!level) return null;
		if (level instanceof LogLevel) return level;
		if (typeof level==="string") return new LogLevel(level);
	}));
	// make sure not reserved.
	configlevels.forEach((level)=>{
		if (this[level.name.toLowerCase()] || this[level.name.toUpperCase()] ||
		this[level.name.slice(0,1).toUpperCase()+level.name.slice(1).toLowerCase()]) throw new Error("Invalid log level: '"+level.name+"' is a reserved word.");
	});

	this[$LEVELS] = configlevels;

	// add our level functions
	this[$LEVELS].forEach((level)=>{
		let lf = this.log.bind(this,level);

		this[level.name.toLowerCase()] = lf;
		this[level.name.toUpperCase()] = lf;
		this[level.name.slice(0,1).toUpperCase()+level.name.slice(1).toLowerCase()] = lf;
	});
};

const mapLevels = function initLevels(levels) {
	let configlevels = levels;
	if (!configlevels) throw new Error("No levels configured.");
	if (typeof configlevels==="string") configlevels = configlevels.split(",");
	if (!(configlevels instanceof Array)) throw new Error("Invalid levels configured.");

	// map our level functions
	configlevels.forEach((level)=>{
		if (this.getLevel(level)) return; // the level matches a pre-defined level.

		let mapped = this.getLevel(this.config.scopeMap && this.config.scopeMap[level] || this.config.scopeCatchAll);
		let lf = mapped && this.log.bind(this,mapped) || (()=>{});

		this[level.toLowerCase()] = lf;
		this[level.toUpperCase()] = lf;
		this[level.slice(0,1).toUpperCase()+level.slice(1).toLowerCase()] = lf;
	});
};

const initWriters = function initWriters() {
	return new Promise(async (resolve,reject)=>{
		try {
			// clean up old writers.
			this[$WRITERS].forEach((writer)=>{
				writer.stop();
			});
			this[$WRITERS] = [];

			let configwriters = this.config.writers;
			if (!configwriters) throw new Error("No writers configured.");
			if (!(configwriters instanceof Array)) throw new Error("Invalid writers configured.");

			// start new writers.
			this[$WRITERS] = await Promise.all(AwesomeUtils.Array.compact(configwriters.map((config)=>{
				return new Promise(async (resolve,reject)=>{
					try {
						let writer = new WriterManager(this,config,this.config.separate,this.config.noDebugger);
						await writer.start();
						resolve(writer);
					}
					catch (ex) {
						return reject(ex);
					}
				});
			})));

			resolve();
		}
		catch (ex) {
			return reject(ex);
		}
	});
};

const createFieldsFunction = function(fields) {
	let f = "const obj = arguments[0];";
	f += "const level = arguments[1];";
	f += "const text = arguments[2];";
	f += "const args = arguments[3];";

	fields.split(",").forEach((field)=>{
		field = field.toLowerCase();

		let pid = process.pid;
		let ppid = process.ppid;
		let hostname = OS.hostname();
		let domain = hostname.split(".").slice(-2).join(".");
		let servername = hostname.split(".").slice(0,1);
		let bits = 32;
		let arch = OS.arch();
		if (arch==="arm64" || arch==="mipsel" || arch==="ppc64" || arch==="s390x" || arch==="x64") bits = 64;
		let main = process.mainModule.filename;
		let platform =  OS.platform();
		let cpus =  OS.cpus().length;
		let argv =  process.argv.slice(2).join(" ");
		let execPath =  process.execPath;
		let startingDirectory =  process.cwd();
		let homedir =  OS.homedir();
		let username =  OS.userInfo().username;
		let version =  process.version;

		if (field==="timestamp") f += "obj.timestamp = Date.now();";
		else if (field==="level") f += "obj.level = level && level.name || level;";
		else if (field==="system") {
			f += `const system = ()=>{
				let system = {};
				Error.captureStackTrace(system);
				system = system.stack.split(/\\n/)[4].split(/\\s/);
				system = system[system.length-1];
				let pos = system.lastIndexOf("/");
				if (pos===-1) pos = system.lastIndexOf("\\\\");
				system = system.substring(pos+1);
				system = system.substring(0,system.indexOf(":"));
				return system;
			};`;

			f += "obj.system = system();";
		}
		else if (field==="args") f += "obj.args = args;";
		else if (field==="text") f += "obj.text = text;";
		else if (field==="pid") f += "obj.pid = "+pid+";";
		else if (field==="ppid") f += "obj.ppid = "+ppid+";";
		else if (field==="hostname") f += "obj.hostname = '"+hostname+"';";
		else if (field==="domain") f += "obj.domain = '"+domain+"';";
		else if (field==="servername") f += "obj.servername = '"+servername+"';";
		else if (field==="main") f += "obj.main = '"+main+"';";
		else if (field==="arch") f += "obj.arch = '"+arch+"';";
		else if (field==="platform") f += "obj.platform = '"+platform+"';";
		else if (field==="bits") f += "obj.bits = "+bits+";";
		else if (field==="cpus") f += "obj.cpus = "+cpus+";";
		else if (field==="argv") f += "obj.argv = '"+argv+"';";
		else if (field==="execpath") f += "obj.execpath = '"+execPath+"';";
		else if (field==="exec") f += "obj.execpath = '"+execPath+"';";
		else if (field==="startingdirectory") f += "obj.startingdirectory = '"+startingDirectory+"';";
		else if (field==="startingdir") f += "obj.startingdirectory = '"+startingDirectory+"';";
		else if (field==="homedir") f += "obj.homedir = '"+homedir+"';";
		else if (field==="home") f += "obj.homedir = '"+homedir+"';";
		else if (field==="username") f += "obj.username = '"+username+"';";
		else if (field==="user") f += "obj.username = '"+username+"';";
		else if (field==="version") f += "obj.version = "+version+";";
	});

	f += "return obj;";

	return new Function(f).bind(this);
};

const createWriteFunction = function createWriteFunction() {
	let f = "const logentry = arguments[0];";
	f += "const history = arguments[1];";
	f += "const historyFormatter = arguments[2];";
	f += "const buffer = arguments[3];";
	f += "const writers = arguments[4];";
	f += "const scheduleDrain = arguments[5];";

	if (this.config.history) {
		let historySizeLimit = this.config.historySizeLimit;
		f += "history.push(historyFormatter.format(logentry));";
		f += "if (history.length>"+historySizeLimit+") history.shift();";
	}

	if (this.config.buffering) {
		f += "buffer.push(logentry);";
		f += "scheduleDrain.call(this);";
	}
	else {
		f += "writers.forEach((writer)=>{";
		f += "writer.write([logentry]);";
		f += "});";
	}
	return new Function(f).bind(this);
};

const write = function write(logentry) {
	this[$WRITEFUNC](logentry,this[$HISTORY],this[$HISTORYFORMATTER],this[$BUFFER],this[$WRITERS],scheduleDrain);
};

const scheduleDrain = function scheduleDrain() {
	if (this[$DRAINSCHEDULED]) return;
	this[$DRAINSCHEDULED] = true;
	process.nextTick(drain.bind(this));
};

const drain = function drain() {
	this[$DRAINSCHEDULED] = false;
	this[$WRITERS].forEach((writer)=>{
		writer.write(this[$BUFFER]);
	});
	this[$BUFFER].length = 0;
};

const subProcessHandler = function subProcessHandler(message) {
	if (!message) return;
	if (!message.cmd) return;
	if (!message.cmd==="AWESOMELOG.ENTRY") return;

	let logentry = message.logentry;
	this.getLevel(logentry.level); // cuases an exception of the process used a level we dont know.

	this.log(logentry);
};

// export our singleton instance.
module.exports = new AwesomeLog();
