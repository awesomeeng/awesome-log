/*
	An example of how to basically use AwesomeLog.
 */

"use strict";

const Log = require("awesome-log");

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
Log.info("Example","This is an example log message.");

// You do Log.init() and Log.start() once for your application, and then can
// use it anywhere in your application.
//
// It's best if Log.init() and Log.start() live at the top of your
// application code, probably in the code entry point.
//
