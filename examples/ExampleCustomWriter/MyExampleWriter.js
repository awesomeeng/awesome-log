/*
	An example Writer.

	For this example, we are just going to prepend a one up number to
	each log message.  Other custom writers could do just about anything
	else from writing to a database to vocalizing log messages out to
	and audio source.
 */

"use strict";

// First we need to import AwesomeLog.
const Log = require("@awesomeeng/awesome-log");

// Next we need to expose the AwesomeLog.AbstractLogWriter class which we
// will subclass in just a second.
const AbstractLogWriter = Log.AbstractLogWriter;

// Here's our one up counter.
let counter = 0;

// So here we create our new writer class by subclassing
// AwesomeLog.AbstractLogWriter.
//
// When you subclass AbstractLogWriter you are required to implement
// four specific methods...
//
//		constructor(parent,type,name,levels,formatter,options)
//
// 		write(message,logentry)
//
// 		flush()
//
// 		close()
//
// 	Some implementations may not require flush() or close() but you
// 	ar still required to implement them, as done in this example.
//
class MyExampleWriter extends AbstractLogWriter {
	// Gotta have the constructor. Make sure to pass the type name
	// for your writer as the second argument. All the other
	// arguments are passed when the writer is constructed during
	// init() phase.
	//
	constructor(parent,name,levels,formatter,options) {
		super(parent,"MyExampleWriter",name,levels,formatter,options);
	}

	// Here we implement the write(message,logentry) function.
	//
	// We are simple writing to console, but we are prepending message
	// with our one up number.
	//
	write(message/*,logentry*/) {
		/* eslint no-console: off */
		console.log((++counter)+" : "+message);
	}

	// We dont need to do anthing for flush actions, so we can just leave
	// this function blank.
	//
	flush() {
		// implement if you need this.
	}

	// Likewise, we dont need to do anything for close actions, so we can
	// just leave this function blank as well.
	//
	close() {
		// implement if you need this.
	}
}

// You dont actually need to export the class as its not getting used
// like that, but old habbits die hard.
//
module.exports = MyExampleWriter;

// Final step is to register the writer with the Log system.
//
// We do this by giving it a common unique name, and passing
// the class we defined into it. The unique name we use here
// is the name by which others will reference this formatter.
// So choose something meaningful.
//
// When the writer is used an instance of it will be created, and
// the various write, flush, close methods will be called.
//
Log.defineWriter("my-example-writer",MyExampleWriter);
