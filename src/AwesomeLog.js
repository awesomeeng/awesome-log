// (c) 2018-2023, The Awesome Engineering Company, https://awesomeeng.com

"use strict";

// External dependencies
const OS = require("os");
const Process = require("process");
const ChildProcess = require("child_process");
const AwesomeUtils = require("@awesomeeng/awesome-utils");

// Internal Dependencies
const LogLevel = require("./LogLevel");
const LogExtensions = require("./LogExtensions");
const WriterManager = require("./WriterManager");
const AbstractLogWriter = require("./AbstractLogWriter");
const AbstractLogFormatter = require("./AbstractLogFormatter");

// Set up worker threads, if they are available.
let Worker;
try {
	Worker = require('worker_threads');
}
catch (ex) {
	Worker = null;
}

// define our global symbols
// We use symbols for private methods and members on objects, because
// private methods and members were not available when written
const $INSTANCE = Symbol.for('@awesomeeng/awesome-log'); // global instance name, used at bottom
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
const $OVERRIDE = Symbol("logEntryOverride");
const $SUBPROCESSCOUNTER = Symbol("subprocessCounter");
const $SUBPROCESSRECENTS = Symbol("subprocessRecents");

/**
 * A class for providing a way to quickly mutate the produced LogEntry during a single Log.xyz() call.
 * 
 * For example, say you want to add a field to a log entry after you call `Log.error(ex)` called `errorNote`. 
 * You do this by creating a LogEntryOverride instance and passing it as part of the `Log.error()` call
 * as shown here...
 * 
 * 		const override = new Log.LogEntryOverride({
 * 			errorNote: 'This was an error.',
 * 		});
 * 		Log.error(ex,override);
 * 
 * Before the LogEntry is sent off to be written, the items passed into `Log.xyz()` will get scanned for
 * overrides and those overrides merged into the LogEntry. Then the resulting LogEntry will get sent
 * to be written.
 */
class LogEntryOverride {
	constructor(details = {}) {
		this[$OVERRIDE] = details || {};
	}

	get details() {
		return this[$OVERRIDE] || {};
	}
}

/**
 * AwesomeLog is a singleton object returned when you
 * `const Log = require("@awesomeeng/awesome-log")`. From it you
 * can initialize and start your log service and then begin writing
 * log messages out. Please see our
 * {@link ../README.md extensive documentation} for usage details.
 */
class AwesomeLog {
	constructor() {
		// default state
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
		this[$STARTPENDING] = false;
		this[$SUBPROCESSCOUNTER] = 0;
		this[$SUBPROCESSRECENTS] = new Map(); // subprocess/counter

		// if we are a subprocess we want to look at what kind of subprocess we are...
		// If we were run by nodemon, forever, or pm2, we are not really a sub-process.
		this[$ISSUBPROCESS] = !!Process.channel || Worker && Worker.parentPort && Worker.parentPort.postMessage && true || false;
		if (Process.channel) {
			if (process.platform==="win32") {
				try {
					let ppid = process.ppid;
					let processes = ChildProcess.execSync("wmic process get processid,commandline").toString().split(/\r\r/);
					let re = new RegExp("\\s"+ppid+"$");
					processes = processes.filter((line)=>{
						return line && line.trim().match(re) || false;
					});
					let line = processes[0];
					if (line && line.indexOf("\\nodemon")>-1 || line.indexOf("\\forever")>-1 || line.indexOf("\\pm2")>-1) this[$ISSUBPROCESS] = false;
				}
				catch (ex) {
					// intentionally empty
				}
			}
			else {
				let pexec = process.env["_"];
				if (pexec && (pexec.indexOf("/nodemon")>-1 || pexec.indexOf("/forever")>-1 || pexec.indexOf("/pm2")>-1)) this[$ISSUBPROCESS] = false;
				let nls = process.env['npm_lifecycle_script'];
				if (nls && (nls.indexOf("nodemon")>-1 || nls.indexOf("forever")>-1 || nls.indexOf("pm2")>-1)) this[$ISSUBPROCESS] = false;
			}
		}

		// setup the default log levels. These can be changed via config later, but we provide the 
		// standard initially to get things rolling.
		initLevels.call(this,"access,error,warn,info,debug");
	}

	/**
	 * Returns the LogEntryOverride class for use mutating LogEntry objects after a call to Log.xyz().
	 *
	 * @return {Class<LogEntryOverride>}
	 */
	get LogEntryOverride() {
		return LogEntryOverride;
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
	 *   noDebugger: true,
	 *   history: true,
	 *   historySizeLimit: 100,
	 *   historyFormatter: "default",
	 *   historyFormatterOptions: {},
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
		let prod = (process.env.NODE_ENV||'').toLowerCase();
		prod = prod === "production" || prod === "prod";

		// merge any passed settings into our default settings.
		config = AwesomeUtils.Object.extend({
			separate: true,
			noDebugger: true,
			buffering: false,
			history: true,
			historySizeLimit: 100,
			historyFormatter: "default",
			historyFormatterOptions: {},
			levels: "access,error,warn,info,debug",
			disableLoggingNotices: !disableSP && this[$ISSUBPROCESS] ? true : false,
			loggingNoticesLevel: "info",
			fields: !prod ? "timestamp,pid,system,level,text,args" : "timestamp,pid,level,text,args", // removes "system" on production environments.
			writers: [],
			backlogSizeLimit: 1000,
			disableSubProcesses: false,
			scopeMap: null,
			scopeCatchAll: "info",
			timestampFormat: "epoch", // "epoch" or "iso8601" (or "iso" or "ISO8601")
			hooks: {
				beforeLog: null,
				afterLog: null,
				beforeLogEntry: null,
				afterLogEntry: null,
				beforeWrite: null,
				afterWrite: null,
				beforeStart: null,
				afterStart: null,
				beforeStop: null,
				afterStop: null,
			}
		},config||{});
		disableSP = config.disableSubProcesses;

		// if we havent been initialized yet, do so now.
		if (!this.initialized) {
			// make sure we have at least one writer. 
			// if we are a sub process, the default writer might need to be different.
			if (config.writers.length<1) config.writers.push({
				name: "DefaultWriter",
				type:  !disableSP && this[$ISSUBPROCESS] ? "null" : "default",
				levels: "*",
				formatter: !disableSP && this[$ISSUBPROCESS] ? "jsobject" : "default",
				options: {}
			});

			// setup our configed log levels
			initLevels.call(this,config.levels);
			if (!this.getLevel(config.loggingNoticesLevel)) config.loggingNoticesLevel = this.levels.slice(-1)[0] && this.levels.slice(-1)[0].name || null;

			// setup history logging.
			let histformpath = LogExtensions.getFormatter(config.historyFormatter);
			if (!histformpath) throw new Error("Invalid history formatter.");
			if (!AwesomeUtils.FS.existsSync(histformpath)) throw new Error("Formatter not found at "+histformpath+".");
			this[$HISTORYFORMATTER] = new (require(histformpath))(config.historyFormatterOptions||{});

			// store our config for reference
			this[$CONFIG] = config;

			// build a single repeatable fields() function programatically. Makes things faster.
			// this must come after this[$CONFIG] is set.
			this[$FIELDSFUNC] = createFieldsFunction.call(this,config.fields);
			
			// build a single repeatable write() function programatically. Makes things faster.
			// this must come after this[$CONFIG] is set.
			this[$WRITEFUNC] = createWriteFunction.call(this);

			// Log out that we initialized.
			// this must come after this[$CONFIG] is set.
			if (!config.disableLoggingNotices) this.log(config.loggingNoticesLevel,"AwesomeLog initialized for levels "+this.levelNames.join("|")+".");
		}
		else {
			// if we were already initialized, lets make sure our levels are mapped to functions.
			mapLevels.call(this,config.levels);

			// and log out that we initialized.
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

		// if ew are already started, do nothing.
		if (this.running) return Promise.resolve(this);

		// If start() was called before init(), setup init() for default values.
		if (this[$CONFIG]===null) this.init();

		this[$STARTPENDING] = true;
		this[$RUNNING] = true;
		this[$HISTORY] = [];

		// Log that we started.
		if (!this.config.disableLoggingNotices) this.log(this.config.loggingNoticesLevel,"AwesomeLog started.");

		// return a promise and then do our start behavior.
		return new Promise(async (resolve,reject)=>{
			try {
				// fire the beforeStart hook.
				fireHook.call(this,"beforeStart",this);

				// start our writers
				await initWriters.call(this);

				// setup any subprocess we have.
				[...this[$SUBPROCESSES].keys()].forEach((subprocess)=>{
					this[$SUBPROCESSES].delete(subprocess);
					this.captureSubProcess(subprocess);
				});

				// make sure anything logged prior to start gets written out now.
				if (this[$BACKLOG]) {
					this[$BACKLOG].forEach((logentry)=>{
						write.call(this,logentry);
					});
				}
				this[$BACKLOG] = null;

				this[$STARTPENDING] = false;

				// fire the afterStart hook.
				fireHook.call(this,"afterStart",this);

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
		// if not started, do nothing.
		if (!this.running || this[$STARTS]>1) return Promise.resolve(this);

		// return a promise, then do our stop stuff.
		return new Promise((resolve,reject)=>{
			// stop needs to make sure start wasnt called before it but not yet run.
			// to do this, we need to check that state and then stop only after that
			// state is resolved.
			try {
				// make sure we are not pending a start, and if so, stop after that happens.
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
					
					// log that we are stopping.
					if (!this.config.disableLoggingNotices) this.log(this.config.loggingNoticesLevel,"AwesomeLog stopped.");
					
					// return a promise, then do our stop.
					return new Promise(async (resolve,reject)=>{
						try {
							// fire the beforeStop hook.
							fireHook.call(this,"beforeStop",this);
							
							// cler up any subprocesses we were monitoring.
							[...this[$SUBPROCESSES].keys()].forEach((subprocess)=>{
								this.releaseSubProcess(subprocess);
								this[$SUBPROCESSES].set(subprocess,null);
							});

							// stop all the writers.
							await Promise.all(this[$WRITERS].map((writer)=>{
								return writer.stop(0);
							}));

							// fire the afterStop hook.
							fireHook.call(this,"afterStop",this);
							
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
	 * @param  {string|LogLevel|LogEntry} level
	 * @param  {string} text
	 * @param  {*} args
	 * @return {AwesomeLog}
	 */
	log(level,text,...args) {
		// fire the beforeLog hook.
		fireHook.call(this,"beforeLog",...arguments);
		
		// parse out what was passed in and how it plays into logging.
		// generally speaking we log everything out that is sent, but there
		// are a lot of ways to send it in.
		let logentry = {};
		if (!text && level && typeof level==="object" && !(level instanceof LogLevel) && !(level instanceof LogEntryOverride)) {
			logentry = level;
			text = logentry.text||"";
			args = logentry.args||[];
			level = logentry.level||"";
		}
		if (text && typeof text==="object" && !(text instanceof Error) && !(text instanceof LogEntryOverride)) {
			logentry = text;
			text = logentry.text||"";
			args = logentry.args||[];
			level =logentry.level||level||"";
		}
		if (text instanceof Error) {
			args.unshift(text);
			text = text.message;
		}
		if (text instanceof LogEntryOverride) {
			const texthold = args.shift();
			args.unshift(text);
			text = texthold;
		}

		// handle a false log message.
		if (!text) {
			if (text===null) text = "<null>";
			else if (text===undefined) text = "<undefined>";
			else if (text===false) text = "false";
			else if (text===0) text = "0";
			else if (text==="") text = "<empty string>";
			else text = ""+text;
		}

		// extract out the level for this log message.
		level = this.getLevel(level).name;

		// pull out any LogEntryOverrides
		// LogEntryOverrides allow you to change a log entry on a call by call basis, but
		// since we log out everything passed into a log call, we needed a special 
		// "marker" to diferentiate these overrides.
		const overrides = args.filter(arg => arg instanceof LogEntryOverride);
		args = args.filter(arg => !(arg instanceof LogEntryOverride));

		// fire the beforeLogEntry hook.
		fireHook.call(this,"beforeLogEntry",logentry);
		
		// compute the log entry.
		logentry = this[$FIELDSFUNC](logentry,level,text,args);

		// apply overrides, if any
		overrides.forEach(override => logentry = Object.assign(logentry,override.details));
		
		// fire the afterLogEntry hook.
		fireHook.call(this,"afterLogEntry",logentry);
		
		// fire the beforeWrite hook.
		fireHook.call(this,"beforeWrite",logentry);
		
		// if backlogging is on (paused or unstarted state), write to the backlog for now.
		if (this[$BACKLOG]) {
			this[$BACKLOG].push(logentry);
			if (this[$BACKLOG].length>this.config.backlogSizeLimit) this[$BACKLOG].shift();
		}
		// otherwise, if we are a subprocess, send the log entry to the parent process.
		else if (this[$ISSUBPROCESS] && !this.config.disableSubProcesses) {
			this[$SUBPROCESSCOUNTER] += 1;
			if (AwesomeUtils.Workers.enabled && AwesomeUtils.Workers.Workers && AwesomeUtils.Workers.Workers.parentPort) {
				AwesomeUtils.Workers.Workers.parentPort.postMessage({
					cmd: "AWESOMELOG.ENTRY",
					counter: this[$SUBPROCESSCOUNTER],
					logentry
				});
			}
			else {
				process.send({
					cmd: "AWESOMELOG.ENTRY",
					counter: this[$SUBPROCESSCOUNTER],
					logentry
				});
			}
		}
		// otherwise, write the entry out via our writers
		else {
			write.call(this,logentry);
		}
		
		// fire the afterWrite hook.
		fireHook.call(this,"afterWrite",logentry);
		
		// fire the afterLog hook.
		fireHook.call(this,"afterLog",logentry);
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

		this[$SUBPROCESSES].set(subprocess,subProcessHandler.bind(this,subprocess));
		this[$SUBPROCESSRECENTS].set(subprocess,[]);

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
		
		this[$SUBPROCESSRECENTS].delete(subprocess);
		this[$SUBPROCESSES].delete(subprocess);

		return this;
	}

	/**
	 * Removes awesomelog global instace. used mostly in testing.
	 */
	unrequire() {
		delete process[$INSTANCE];
		AwesomeUtils.Module.unrequire(module.filename);
	}
}

/**
 * @private
 * 
 * Internal method for setting up log levels and addinging and removing the level specific 
 * functions like debug() or error().
 */
const initLevels = function initLevels(levels) {
	// If we have pre-existing levels, remove the functions...
	this[$LEVELS].forEach((level)=>{
		delete this[level.name.toLowerCase()];
		delete this[level.name.toUpperCase()];
		delete this[level.name.slice(0,1).toUpperCase()+level.name.slice(1).toLowerCase()];
	});

	// clear it out
	this[$LEVELS] = [];


	let configlevels = levels;

	// error out if no levels setup.
	if (!configlevels) throw new Error("No levels configured.");
	
	// convert to an array
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

	// store it for usage
	this[$LEVELS] = configlevels;

	// add our level functions
	this[$LEVELS].forEach((level)=>{
		let lf = this.log.bind(this,level);

		this[level.name.toLowerCase()] = lf;
		this[level.name.toUpperCase()] = lf;
		this[level.name.slice(0,1).toUpperCase()+level.name.slice(1).toLowerCase()] = lf;
	});
};

/**
 * @private
 * 
 * Internal function to map levels if provided in configuration. Mapping translates a level like
 * "silly" to "debug" or something like that. purely optional.
 */
const mapLevels = function mapLevels(levels) {
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

/**
 * @private
 * 
 * Internal function to initialize our writers.
 */
const initWriters = function initWriters() {
	return new Promise(async (resolve,reject)=>{
		try {
			// clean up old writers.
			this[$WRITERS].forEach((writer)=>{
				writer.stop();
			});
			this[$WRITERS] = [];

			// Error out if there are no writers.
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

/**
 * @private
 * 
 * Internal function to build a single function to add additional fields to a log entry as
 * desired. We recreate this function when config changes, such that we can easily reuse it instead of calling
 * a more generic one over and over. This gives us some performance gain on each write because we dont
 * need to recompute every time.
 */
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
		let main = process.mainModule && process.mainModule.filename || process.main && process.main.filename || process.cwd();
		let platform =  OS.platform();
		let cpus =  OS.cpus().length;
		let argv =  process.argv.slice(2).join(" ");
		let execPath =  process.execPath;
		let startingDirectory =  process.cwd();
		let homedir =  OS.homedir();
		let username =  OS.userInfo().username;
		let version =  process.version;
		let timestampISO = !!(this.config.timestampFormat.match(/^iso(8601)?$/i));

		if (field==="timestamp" && timestampISO) f += "obj.timestamp = new Date().toISOString();";
		else if (field==="timestamp" && !timestampISO) f += "obj.timestamp = Date.now();";
		else if (field==="level") f += "obj.level = level && level.name || level;";
		else if (field==="system" || field.startsWith('system:')) {
			const depth = field.startsWith('system:') && parseInt(field.slice(7),10) || 1;
			f += `const system = ()=>{
				let system = {};
				Error.captureStackTrace(system);
				system = (system.stack.split(/\\n/)[3+${depth}] || "").split(/\\s/);
				system = system[system.length-1];
				let pos = system.lastIndexOf("/");
				if (pos===-1) pos = system.lastIndexOf("\\\\");
				system = system.substring(pos+1);
				system = system.substring(0,system.indexOf(":"));
				system = system || "<unknown>";
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

/**
 * @private
 * 
 * Internal functions to create a function to write a log message out to our writers. We 
 * create this function anew any time config changes, such that we do not have to use a more
 * generic and slower functions. This means each call to write a log message is thus faster.
 */
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

/**
 * @private
 * 
 * Internal function to call the write functions created above. Just a shortcut really.
 */
const write = function write(logentry) {
	this[$WRITEFUNC](logentry,this[$HISTORY],this[$HISTORYFORMATTER],this[$BUFFER],this[$WRITERS],scheduleDrain);
};

/**
 * @private
 * 
 * Internal function to schedule a drain event when buffering is in use.
 */
const scheduleDrain = function scheduleDrain() {
	if (this[$DRAINSCHEDULED]) return;
	this[$DRAINSCHEDULED] = true;
	process.nextTick(drain.bind(this));
};

/**
 * @private
 * 
 * Internal function to drain the buffer to the writters, if buffering is used.
 */
const drain = function drain() {
	this[$DRAINSCHEDULED] = false;
	this[$WRITERS].forEach((writer)=>{
		writer.write(this[$BUFFER]);
	});
	this[$BUFFER].length = 0;
};

/**
 * @private
 * 
 * Internal function to handle subprocess messaging.
 */
const subProcessHandler = function subProcessHandler(subprocess,message) {
	if (!message) return;
	if (!message.cmd) return;
	if (!message.cmd==="AWESOMELOG.ENTRY") return;

	// check for duplicate messages.
	if (message.counter!==undefined) {
		const recents = this[$SUBPROCESSRECENTS].get(subprocess);

		if (recents.includes(message.counter)) return;

		recents.push(message.counter);
		if (recents.length>150) this[$SUBPROCESSRECENTS].set(subprocess,recents.slice(50));
	}

	let logentry = message.logentry;
	this.getLevel(logentry.level); // cuases an exception of the process used a level we dont know.

	this.log(logentry);
};

/**
 * @private
 * 
 * Internal function to fire any hook, if setup.
 */
const fireHook = function fireHook(hookName,...args) {
	if (!hookName) return null;

	const hook = this.config && this.config.hooks && this.config.hooks[hookName] || null;
	if (hook && hook instanceof Function) {
		try {
			hook(...args);
		}
		catch (ex) {
			this.log("Error in AwesomeLog configured "+hookName+" hook.",ex);
		}
	}
};

// export our singleton instance.
// we use a symbol here to expose log across
// multiple installs, with the first insall winning.

let instance = process[$INSTANCE];
if (!instance) instance = new AwesomeLog();
process[$INSTANCE] = instance;

module.exports = instance;
