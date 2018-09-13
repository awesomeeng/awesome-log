/*
	An example custom formatter.

	For this example, we are going to just change
	up the default formatter ordering.  We will do
	pid,timestamp,system,level,message,args as
	opposed to the default formatter order of
	timestamp,pid,level,system,message,args.

	We will also not do any spacing formatting, which
	is something the default formatter does.

	A formatter like this might be really useful when
	you need to sort logs by process id.
 */
"use strict";

// First we need to import AwesomeLog.
const Log = require("@awesomeeng/awesome-log");

// Next we need to expose the AwesomeLog.AbstractLogFormatter class which we
// will subclass in just a second.
const AbstractLogFormatter = Log.AbstractLogFormatter;

// So here we create our new writer class by subclassing
// AwesomeLog.AbstractLogFormatter.
//
// When you subclass AbstractLogFormatter you are required to implement
// two specific methods...
//
//		constructor(parent)
//
// 		format(logentry)
//
class MyExampleFormatter extends AbstractLogFormatter {
	// Implement the constructor by just calling super.
	// In most cases for formatter, this is fine.
	constructor(parent) {
		super(parent);
	}

	// Now implement the format function. The format function
	// take in a logentry object consisting of timestamp,
	// pid, level, system, message, and arguments. It is the
	// job of this function to format it into a string to
	// be written out.
	//
	// The string encoding should be the system default utf-8.
	//
	// Whatever is returned from format is written to the log
	// writers.
	//
	format(logentry) {
		let msg = "";

		msg += "#"+logentry.pid+"";
		msg += " : ";
		msg += new Date(logentry.timestamp).toISOString();
		msg += " : ";
		msg += logentry.system;
		msg += " : ";
		msg += logentry.level.name;
		msg += " : ";
		msg += logentry.message;

		return msg;
	}
}

// You dont actually need to export the class as its not getting used
// like that, but old habbits die hard.
//
module.exports = MyExampleFormatter;

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
Log.defineFormatter("my-example-formatter",MyExampleFormatter)
