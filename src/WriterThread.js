// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

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
 */
class WriterThread {
	constructor(config) {
		let name = config.name || null;
		if (!name) {
			this.sendError("Missing name.");
			process.exit(1);
		}

		let levels = config.levels || "*";
		if (!levels) {
			this.sendError("Missing levels.");
			process.exit(1);
		}

		let writerType = config.writerType || null;
		if (!writerType) {
			this.sendError("Missing writerType.");
			process.exit(1);
		}

		let writerPath = config.writerPath || "default";
		if (!writerPath) {
			this.sendError("Missing writerPath.");
			process.exit(1);
		}

		let writerOptions = config.writerOptions || "default";
		if (!writerOptions) {
			this.sendError("Missing writerOptions.");
			process.exit(1);
		}

		let formatterType = config.formatterType || null;
		if (!formatterType) {
			this.sendError("Missing formatterType.");
			process.exit(1);
		}

		let formatterPath = config.formatterPath || "default";
		if (!formatterPath) {
			this.sendError("Missing formatterPath.");
			process.exit(1);
		}

		let formatterOptions = config.formatterOptions || "default";
		if (!formatterOptions) {
			this.sendError("Missing formatterOptions.");
			process.exit(1);
		}

		this[$NAME] = name;
		this[$LEVELS] = levels;
		this[$WRITERTYPE] = writerType;
		this[$WRITERPATH] = writerPath;
		this[$WRITEROPTIONS] = writerOptions;
		this[$FORMATTERTYPE] = formatterType;
		this[$FORMATTERPATH] = formatterPath;
		this[$FORMATTEROPTIONS] = formatterOptions;
	}

	get name() {
		return this[$NAME];
	}

	get levels() {
		return this[$LEVELS];
	}

	start() {
		try {
			this[$FORMATTER] = new (require(this[$FORMATTERPATH]))(this[$FORMATTEROPTIONS]);
		}
		catch (ex) {
			this.sendError("Error initializing formatter at "+this[$FORMATTERPATH]+".");
			this.stop(1);
		}

		try {
			this[$WRITER] = new (require(this[$WRITERPATH]))(this[$WRITEROPTIONS]);
		}
		catch (ex) {
			this.sendError("Error initializing writer at "+this[$WRITERPATH]+".");
			this.stop(1);
		}

		process.on("message",(msg)=>{
			let cmd = msg && msg.cmd || null;
			if (cmd==="AWESOMELOG.WRITER.ENTRIES") {
				this.write(msg.entries);
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

	stop(exitCode) {
		if (this[$WRITER]) {
			this[$WRITER].flush();
			this[$WRITER].close();
		}
		this[$WRITER] = null;
		this[$FORMATTER] = null;

		process.exit(exitCode);
	}

	write(entries) {
		entries.forEach((entry)=>{
			let msg = this[$FORMATTER] && this[$FORMATTER].format(entry) || entry;
			this[$WRITER].write(msg,entry);
		});
	}

	send(msg) {
		process.send(msg);
	}

	sendReady() {
		this.send({
			cmd: "AWESOMELOG.WRITER.READY"
		});
	}

	sendError(err) {
		this.send({
			cmd: "AWESOMELOG.WRITER.ERROR",
			details: err
		});
	}
}

(async ()=>{
	let writerThread = new WriterThread(JSON.parse(process.env.AWESOMELOG_WRITER_CONFIG||"{}"));
	await writerThread.start();
})();
