// (c) 2018-2023, The Awesome Engineering Company, https://awesomeeng.com

"use strict";

const $NAME = Symbol("name");
const $LEVELS = Symbol("levels");
const $WRITER = Symbol("writer");
const $WRITERTYPE = Symbol("writerType");
const $WRITERPATH = Symbol("writerPath");
const $WRITEROPTIONS = Symbol("writerOptions");
const $FORMATTER = Symbol("formatter");
const $FORMATTERTYPE = Symbol("formatterType");
const $FORMATTERPATH = Symbol("formatterPath");
const $FORMATTEROPTIONS = Symbol("formatterOptions");

/**
 * @private
 * 
 * When a writer is a separate process, we need to spin up a separate thread. This class is the
 * code that thread runs.
 * 
 * Config for the writer is passed in as a json string in an env variable to this process.
 */
class WriterThread {
	constructor(config) {
		// validate the config name
		let name = config.name || null;
		if (!name) {
			this.sendError("Missing name.");
			process.exit(1);
		}

		// validate the config levels
		let levels = config.levels || "*";
		if (!levels) {
			this.sendError("Missing levels.");
			process.exit(1);
		}

		// validate the config type
		let writerType = config.writerType || null;
		if (!writerType) {
			this.sendError("Missing writerType.");
			process.exit(1);
		}

		// validate the config write path (the path to the writer in node)
		let writerPath = config.writerPath || "default";
		if (!writerPath) {
			this.sendError("Missing writerPath.");
			process.exit(1);
		}

		// validate the writer options
		let writerOptions = config.writerOptions || "default";
		if (!writerOptions) {
			this.sendError("Missing writerOptions.");
			process.exit(1);
		}

		// validate the formatter type
		let formatterType = config.formatterType || null;
		if (!formatterType) {
			this.sendError("Missing formatterType.");
			process.exit(1);
		}

		// validate the formater path, that is the path to the formatter code in node
		let formatterPath = config.formatterPath || "default";
		if (!formatterPath) {
			this.sendError("Missing formatterPath.");
			process.exit(1);
		}

		// validate the formatter options
		let formatterOptions = config.formatterOptions || "default";
		if (!formatterOptions) {
			this.sendError("Missing formatterOptions.");
			process.exit(1);
		}

		// set everything
		this[$NAME] = name;
		this[$LEVELS] = levels;
		this[$WRITERTYPE] = writerType;
		this[$WRITERPATH] = writerPath;
		this[$WRITEROPTIONS] = writerOptions;
		this[$FORMATTERTYPE] = formatterType;
		this[$FORMATTERPATH] = formatterPath;
		this[$FORMATTEROPTIONS] = formatterOptions;
	}

	/**
	 * Return the name of this writer.
	 */
	get name() {
		return this[$NAME];
	}

	/**
	 * Return the levels of this writer.
	 */
	get levels() {
		return this[$LEVELS];
	}

	/**
	 * Start the writer.
	 */
	start() {
		// Need to init the formatter.
		try {
			this[$FORMATTER] = new (require(this[$FORMATTERPATH]))(this[$FORMATTEROPTIONS]);
		}
		catch (ex) {
			this.sendError("Error initializing formatter at "+this[$FORMATTERPATH]+".");
			this.stop(1);
		}

		// THen init the writer
		try {
			this[$WRITER] = new (require(this[$WRITERPATH]))(this[$WRITEROPTIONS]);
		}
		catch (ex) {
			this.sendError("Error initializing writer at "+this[$WRITERPATH]+".");
			this.stop(1);
		}

		// then we start processing message sent from the parent process / WriterManager.
		process.on("message",(msg)=>{
			let cmd = msg && msg.cmd || null;
			if (!cmd) {
				this.write(msg);
			}
			else if (cmd==="AWESOMELOG.WRITER.FLUSH") {
				this[$WRITER].flush();
				this.send({
					cmd: "AWESOMELOG.WRITER.FLUSHED"
				});
			}
			else if (cmd==="AWESOMELOG.WRITER.CLOSE") {
				this.stop(0);
				this.send({
					cmd: "AWESOMELOG.WRITER.CLOSED"
				});
			}
		});

		this.sendReady();
	}

	/**
	 * Stop the writer.
	 */
	stop(exitCode) {
		// flush and close
		if (this[$WRITER]) {
			this[$WRITER].flush();
			this[$WRITER].close();
		}
		this[$WRITER] = null;
		this[$FORMATTER] = null;

		// exit the thread
		process.exit(exitCode);
	}

	/**
	 * Write one or more log entries.
	 */
	write(entries) {
		entries.forEach((entry)=>{
			if (entry.args) {
				entry.args = entry.args.map((arg)=>{
					return reformArg(arg);
				});
			}
			let msg = this[$FORMATTER] && this[$FORMATTER].format(entry) || entry;
			this[$WRITER].write(msg,entry);
		});
	}

	/**
	 * Send a message back to the parent writer manager
	 */
	send(msg) {
		process.send(msg);
	}

	/**
	 * Send the READY message back to the parent writer manager
	 */
	sendReady() {
		this.send({
			cmd: "AWESOMELOG.WRITER.READY"
		});
	}

	/**
	 * Send the ERROR message back to the parent writer maanger
	 */
	sendError(err) {
		this.send({
			cmd: "AWESOMELOG.WRITER.ERROR",
			details: err
		});
	}
}

/**
 * @private
 * 
 * Internal method to deserialize error messages coming from the parent writer manager.
 */
const reformArg = function reformArg(arg) {
	if (arg && arg.__TYPE==="error") {
		let e = new Error(arg.message);
		e.stack = arg.stack;
		e.cause = reformArg(arg.cause);
		return e;
	}
	return arg;
};

/**
 * Deserialize the config and start the thread running.
 */
(async ()=>{
	let writerThread = new WriterThread(JSON.parse(process.env.AWESOMELOG_WRITER_CONFIG||"{}"));
	await writerThread.start();
})();
