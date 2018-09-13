/*
	An example of how to implement a custom formatter.
 */

"use strict";

// First we require log.
const Log = require("@awesomeeng/awesome-log");

// Second, we require the writer we want to use.
require("./MyExampleFormatter");

// Then initialize, just like in basic usage. However,
// you need to pass the formatter to each writer in to the writers
// configuration property to enable it.
Log.init({
	writers: [{
		name: "console",
		type: "default",
		levels: "*",
		formatter: "my-example-formatter",
		options: {}
	}]
});

// Then everything is exactly the same as basic usage.
//
// Start the log...
Log.start();

// Log something out to it...
Log.info("Example","This is an example log message.");

// See the MyExampleCustomWriter.js file for implementation details.
