/*
	An example of how to basically use AwesomeLog.
 */

"use strict";

const Log = require("@awesomeeng/awesome-log");

// First we initialize the log system.
//
// This is where we can provide logging configuration, as an argument to Log.init();
//
// If you just want the defaults, pass nothing in.
Log.init();

// Once initialized, we have to start the log system.
Log.start();

// Once the log system is started you can make log statement against the
// various log levels, by default they are access, error, warn, info, debug.
Log.info("This is an example log message.");
Log.info("Another log message with arguments.",1,2,3);
Log.info({
	text: "A log object.",
	red: "red",
	green: 25,
	blue: false
});

// stop logging once we are done.
Log.stop();
