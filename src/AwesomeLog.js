// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");
const Events = require("events");
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
const $BASE = Symbol("base");
const $STARTS = Symbol("starts");
const $BUFFER = Symbol("buffer");
const $DRAINSCHEDULED = Symbol("drainScheduled");

/**
 * AwesomeLog is a singleton object returned when you
 * `const Log = require("@awesomeeng/awesome-log")`. From it you
 * can initialize and start your log service and then begin writing
 * log messages out. Please see our
 * {@link ../README.md extensive documentation} for usage details.
 */
class AwesomeLog extends Events {
	constructor() {
		super();

		const hostname = OS.hostname();
		const domain = hostname.split(".").slice(-2).join(".");
		const servername = hostname.split(".").slice(0,1);
		let bits = 32;
		let arch = OS.arch();
		if (arch==="arm64" || arch==="mipsel" || arch==="ppc64" || arch==="s390x" || arch==="x64") bits = 64;

		this[$BASE] = {
			hostname,
			domain,
			servername,
			pid: process.pid,
			ppid: process.ppid,
			main: process.mainModule.filename,
			arch: OS.arch(),
			platform: OS.platform(),
			bits,
			cpus: OS.cpus().length,
			argv: process.argv.slice(2).join(" "),
			execPath: process.execPath,
			startingDirectory: process.cwd(),
			homedir: OS.homedir(),
			username: OS.userInfo().username,
			version: process.version
		};

		this[$CONFIG] = null;
		this[$BACKLOG] = [];
		this[$HISTORY] = [];
		this[$FUNCTIONS] = {};
		this[$LEVELS] = [];
		this[$WRITERS] = [];
		this[$RUNNING] = false;
		this[$SUBPROCESSES] = new Map();
		this[$STARTS] = 0;
		this[$BUFFER] = [];
		this[$DRAINSCHEDULED] = false;

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
	 * Map a new Log Writer to a specific name, for usage in configuring AwesomeLog.
	 *
	 * @param  {string} name
	 * @param  {string} logWriter
	 * @return {void}
	 */
	defineWriter(name,pathToWriter) {
		return LogExtensions.defineWriter(name,pathToWriter);
	}

	/**
	* Map a new Log Formatter to a specific name, for usage in configuring AwesomeLog.
	*
	* @param  {string} name
	* @param  {string} logFormatter
	* @return {void}
	*/
	defineFormatter(name,pathToFormatter) {
		return LogExtensions.defineFormatter(name,pathToFormatter);
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
	 *   history: true,
	 *   historySizeLimit: 100,
	 *   historyFormatter: "default",
	 *   levels: "access,error,warn,info,debug",
	 *   disableLoggingNotices: false, // true if this is a child process
	 *   loggingNoticesLevel: "info",
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
	 * config.writes = [{
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
			history: true,
			historySizeLimit: 100,
			historyFormatter: "default",
			historyFormatterOptions: {},
			levels: "access,error,warn,info,debug",
			disableLoggingNotices: !disableSP && isSubProcess() ? true : false,
			loggingNoticesLevel: "info",
			captureExecutionSystem: false,
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
				type:  !disableSP && isSubProcess() ? "null" : "default",
				levels: "*",
				formatter: !disableSP && isSubProcess() ? "jsobject" : "default",
				options: {}
			});

			initLevels.call(this,config.levels);
			if (!this.getLevel(config.loggingNoticesLevel)) config.loggingNoticesLevel = this.levels.slice(-1)[0] && this.levels.slice(-1)[0].name || null;

			let histformpath = LogExtensions.getFormatter(config.historyFormatter);
			if (!histformpath) throw new Error("Invalid history formatter.");
			if (!AwesomeUtils.FS.existsSync(histformpath)) throw new Error("Formatter not found at "+histformpath+".");
			this[$HISTORYFORMATTER] = new (require(histformpath))(config.historyFormatterOptions||{});

			if (!config.disableLoggingNotices) this.log(config.loggingNoticesLevel,"AwesomeLog initialized for levels "+this.levelNames.join("|")+".");

			this.emit("initialized",config);

			this[$CONFIG] = config;
		}
		else {
			mapLevels.call(this,config.levels);

			if (!this.config.disableLoggingNotices) this.log(this.config.loggingNoticesLevel,"AwesomeLog mapped levels from dependant module "+config.levels+".");

			this.emit("mapped",config.levels);
		}

		return this;
	}

	/**
	 * Starts AwesomeLog running and outputting log messages. This should be called
	 * very early in your application, in the entry point if possible.
	 *
	 * `startt()` is responsible for initializing the writers.
	 *
	 * If any backlog messages exist when `start()` is called, they will be written
	 * via the writers after they are started.
	 *
	 * @return {void}
	 */
	start() {
		this[$STARTS] += 1;

		if (this.running) return;

		if (this[$CONFIG]===null) this.init();

		this[$RUNNING] = true;
		this[$HISTORY] = [];

		if (!this.config.disableLoggingNotices) this.log(this.config.loggingNoticesLevel,"AwesomeLog started.");

		this.emit("started");

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

				resolve(this);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	/**
	 * Stops AwesomeLog running. Once stopped AwesomeLog can be reconfigured via another
	 * `init()` call.
	 *
	 * @return {void}
	 */
	stop() {
		this[$STARTS] -= 1;

		if (!this.running || this[$STARTS]>1) return;

		this[$BACKLOG] = this[$BACKLOG] || [];
		this[$RUNNING] = false;

		if (!this.config.disableLoggingNotices) this.log(this.config.loggingNoticesLevel,"AwesomeLog stopped.");

		this.emit("stopped");

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
		this.emit("paused");

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
		this.emit("resumed");

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
	 * @param  {string} message
	 * @param  {*} args
	 * @return {AwesomeLog}
	 */
	log(level,message,...args) {
		let logentry = null;

		if (!message && level && typeof level==="object" && !(level instanceof LogLevel) && level.level && level.message && level.args) {
			logentry = level;
			message = logentry.message;
			args = logentry.args;
			level = logentry.level;
		}

		level = this.getLevel(level);
		if (!level) throw new Error("Missing level argument.");
		if (!(level instanceof LogLevel)) throw new Error("Invalid level argument.");
		if (logentry) logentry.level = level;

		args = [].concat(args); // has to come before message check
		if (logentry) logentry.args = args;

		if (!message) throw new Error("Missing message argument.");
		if (message instanceof Error) {
			args.unshift(message);
			message = message.message;
		}
		if (typeof message!=="string") throw new Error("Invalid message argument.");

		let system = "";
		if (this.config.captureExecutionSystem) {
			system = {};
			Error.captureStackTrace(system);
			system = system.stack.split(/\n/)[2].split(/\s/);
			system = system[system.length-1];
			let pos = system.lastIndexOf("/");
			if (pos===-1) pos = system.lastIndexOf("\\");
			system = system.substring(pos+1);
			system = system.substring(0,system.indexOf(":"));
		}

		if (!logentry) {
			logentry = {
				level,
				system,
				message,
				args,
				timestamp: Date.now()
			};
		}

		// this.emit("log",logentry);

		if (this[$BACKLOG]) {
			this[$BACKLOG].push(logentry);
			if (this[$BACKLOG].length>this.config.backlogSizeLimit) this[$BACKLOG] = this[$BACKLOG].slice(Math.floor(this.backlogSizeLimit*0.1));
		}
		else if (!this.config.disableSubProcesses && isSubProcess()) {
			if (AwesomeUtils.Workers.enabled) {
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
			return write.call(this,logentry);
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

const isSubProcess = function isSubProcess() {
	return !!Process.channel || Worker && Worker.parentPort && Worker.parentPort.postMessage || false;
};

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
				writer.flush();
				writer.close();
			});
			this[$WRITERS] = [];

			let configwriters = this.config.writers;
			if (!configwriters) throw new Error("No writers configured.");
			if (!(configwriters instanceof Array)) throw new Error("Invalid writers configured.");

			// start new writers.
			this[$WRITERS] = await Promise.all(AwesomeUtils.Array.compact(configwriters.map((writer)=>{
				if (!writer) return null;

				let manager = new WriterManager(this,writer);
				return manager.start();
			})));

			resolve();
		}
		catch (ex) {
			return reject(ex);
		}
	});
};

const write = function write(logentry) {
	if (!logentry) throw new Error("Missing log entry argument.");

	if (logentry.level && logentry.level.name) logentry.level = logentry.level.name;
	if (this.config.history) {
		this[$HISTORY].push(this[$HISTORYFORMATTER].format(logentry));
		if (this.history.length> this.config.historySizeLimit) this[$HISTORY] = this[$HISTORY].slice(-this.config.historySizeLimit);
	}

	this[$BUFFER].push(logentry);
	scheduleDrain.call(this);
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
