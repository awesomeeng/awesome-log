/*
	An example of how to implement a custom writer.
 */

"use strict";

// First we require log.
const Log = require("@awesomeeng/awesome-log");

// Second, we require the writer we want to use.
require("./MyExampleWriter");

// Then initialize, just like in basic usage. However,
// you need to pass the custom writer in to the writers
// configuration property to enable it.
Log.init({
	writers: [{
		name: "my-writer",
		type: "my-example-writer"
	}]
});

// Then everything is exactly the same as basic usage.
//
// Start the log...
Log.start();

// Log something out to it...
Log.info("This is an example log message.");

// See the MyExampleCustomWriter.js file for implementation details.
