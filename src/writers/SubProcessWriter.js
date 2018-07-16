// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const LogWriter = require("../LogWriter");
let Worker;
try {
	Worker = require('worker_threads');
}
catch (ex) {
	Worker = null;
}

class SubProcessWriter extends LogWriter {
	constructor(parent,name,levels,formatter,options) {
		super(parent,"SubProcess",name,levels,formatter,options);
	}

	write(message,logentry) {
		logentry = Object.assign(logentry);
		logentry.level = logentry.level && logentry.level.name || logentry.level;
		
		if (Worker && Worker.parentPort && Worker.parentPort.postMessage) {
			Worker.parentPort.postMessage({
				cmd: "AwesomeLog",
				logentry
			});
		}
		else if (process.send) {
			process.send({
				cmd: "AwesomeLog",
				logentry
			});
		}
	}

	flush() {
		// intentionally blank
	}

	close() {
		// intentionally blank
	}
}

module.exports = SubProcessWriter;
