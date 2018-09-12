# [AwesomeLog](../README.md) > Log Writers

Log Writer is the channel by which a log message is written to some output device.  Writers are used to send the message to the console, the file system, a database, wherever you need your logs to end up.

## Built-In Writers

AwesomeLog ships with three built-in Log Writers:

- **Console**: Used to output log messages to the STDOUT console. Has the option to colorize output for ANSI compatible terminals.

- **File**: Used to output log message to a given file. Has the capability to specify custom file names including date patterns, and support file rotation and cleanup.

- **Null**: Used to output log messages to /dev/null and make them disappear forever.

## Configuring Writers

You configure your writers when you call `Log.init({})`. The `writers` setting of the passed in object is an array which contains zero or more objects each describing a separate writer to use. Each object represents one writer and its associated configuration.

```
Log.init({
	writers: [{
		name: "MyConsoleWriter",
		type: "console",
		formatter: "default",
		options: {
			colorize: true
		}
	},{
		name: "MyFileWriter",
		type: "file",
		formatter: "json",
		options: {
			housekeeping: "2 hours",
			filename: "logs/MyLogs.{YYYYMMDD}.log"
		}
	}],
});
```

For each writer there are the following configuration settings:

 - **name** [string] - A unique name for this writer. Required.

 - **type** [string] - The type of writer to use. Can be one of the following: `console`, `file`, `null` or your customer writer type. Required.

 - **levels** [string] - What levels are sent to this writer. This is a comma separated string (eg. `error,warn`). A string of `*` means all levels. If ommitted, `*` is assumed.

 - **formatter** [string] - The formatter to use for this writer. `default` if ommitted.  Can be one of the following: `default`, `json`, `csv`, `js`, or the name for your customer formatter.

 - **options** [Object] - An object that contains configuration information that is passed to the writer.  See [Console Writer Configuration](./docs/ConsoleWriterConfiguration) or [File Writer Configuration](./docs/FileWriterConfiguration) for more information.

See [Console Writer Configuration](./docs/ConsoleWriterConfiguration) or [File Writer Configuration](./docs/FileWriterConfiguration) for more information about those specific writers and their configuration.

## The Default Console Writer

By default AwesomeLog is configured to use a default Console Writer. Here is that configuration:

```
Log.init({
	writers: [{
		name: "console",
		type:  "default",
		levels: "*",
		formatter: "default",
		options: {
			colorize: true,
			colorStyle: "level", // "line" or "level"
			colors: {
				ACCESS: "green",
				ERROR: "red",
				WARN: "yellow",
				INFO: "magenta",
				DEBUG: "cyan",
			}
		}
	}]
});
```

## Writing your own Log Writer

AwesomeLog strives to be highly configurable. As such, you are completely able to add your own writers to AwesomeLog.

A custom writer has the following shape, taken from our example [ExampleCustomWriter](./examples/ExampleCustomWriter) class:

```
"use strict";

const Log = require("AwesomeLog");
const AbstractLogWriter = Log.AbstractLogWriter;

let counter = 0;

class MyExampleWriter extends AbstractLogWriter {
	constructor(parent,name,levels,formatter,options) {
		super(parent,"MyExampleWriter",name,levels,formatter,options);
	}

	write(message/*,logentry*/) {
		console.log((++counter)+" : "+message);
	}

	flush() {
		// implement if you need this.
	}

	close() {
		// implement if you need this.
	}
}

Log.defineWriter("my-example-writer",MyExampleWriter);
```

It begins by requiring `AwesomeLog` and `AwesomeLog.AbstractLogWriter`.

Next, we create a class that extends `AwesomeLog.AbstractLogWriter`.

When you subclass AbstractLogWriter you are required to implement four specific methods...

 - `constructor(parent,type,name,levels,formatter,options)`: Called when a new instance of the writer is created. New instances are created during the `Log.start()` call and you need not do it yourself.  You would place any initialization of your writing device here. THe arguments to the constructor are all supplied by AwesomeLog and the configuration passed to `Log.init()`.  `options` specifically is the writer options and can be used during initialization.

 - `write(message,logentry)`: Write is called for every log message and is where you would implement logic to place the log message onto the device to which you are writing.  The message is the string (or object) return by the formatter that should be written out. logentry is the log object from which the message was derived.

 - `flush()`: Flush is called by AwesomeLog before stopping (via Log.stop()) to ensure details are written during shutdown. Not all devices require this, but it still must be included.

 - `close()`: Close is called following `flush()` during shutdown. It is here where you would do any cleanup of your device that is needed.  Not all devices require this, but it still must be included.

Finally, once our new Writer class is set, we call `defineWriter(typeName,logWriter)` to tell AwesomeLog about it.  `defineWriter(typeName,logWriter)` take two arguments, the first the `typeName` is the string value to be used to reference the writer in the `type` setting, and second the `logWriter` is the writer class we just defined (not an instance of the class) to call when the writer is started.

After `defineWriter` is called, one can use the writer in `Log.init()`.
