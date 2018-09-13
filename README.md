# AwesomeLog

AwesomeLog is a Log System for enterprise ready nodejs applications. It provides a basic out of the box logging solution that is ready to go with zero configuration but also gives you a highly configurable logging solution that with the power to do your logging right.

## Why Another Log Solution?

AwesomeLog is similar to Winston, Log, Log4js, etc. and those are all good products.  AwesomeLog just provides a different method of Logging; one we think is cleaner and more stable. If you want to use Winston/Log/Log4js/whatever, that's perfectly fine by us. But if you want to try something a little cleaner, with a bit more features, consider AwesomeLog.

## Features

AwesomeLog provides...
 - Ready to go with zero initial configuration;
 - Configure and Start once, Use Everywhere;
 - Extremely flexible;
 - Customizable Log Levels;
 - Built-In Formatters: Default, JSON, JS, or CSV;
 - Or add your own log formatters;
 - Console and File writers;
 - or add your own custom log writer;
 - Colorized Console Logging;
 - Log History;
 - Pause/Resume;
 - SubProcess Logging;
 - Events for programatic notification of Log changes.

## Contents
 - [Installation](#installation)
 - [Setup](#setup)
 - [Log Levels](#log-levels)
 - [Log Writers](#log-writers)
 - [Log Formatters](#log-formatters)
 - [Documentation](#documentation)
 - [Examples](#examples)
 - [Awesome Engineering](#the-awesome-engineering-company)
 - [Support and Help](#support-and-help)
 - [License](#license)

## Installation

Couldn't be easier.
```
	npm install --save @awesomeeng/awesome-log
```

## Setup

It is best if you configure AwesomeLog at the top of your application. We recommened you do this immediately near the top of your main node entry point.

Setup has three steps:

1). Require AwesomeLog...
```
	const Log = require("@awesomeeng/awesome-log");
```

2). Configure AwesomeLog...
```
	// for out of the box, zero configuration
	Log.init();

	// or for more control
	Log.init({
		// configuration options go here
	});
```

3). Start AwesomeLog...
```
	Log.start();
```

That's it. AwesomeLog is running and you can now use in any part of your application:

## Usage

To use AwesomeLog once it is configured and started is simple:


1). You need to require AwesomeLog in any file/class that would reference it.

```
	const Log = require("@awesomeeng/awesome-log");
```

2). Then you just log stuff out.
```
	Log.info(null,"message");
```

Simple.

You'll notice that Log calls take two or more arguments:

 * The first is the system you are logging from; it lets you think about your code as a series of systems and control how that is displayed. If you set this argument to `null` AwesomeLog will inspect your call stack and use the filename of the code from which you are calling AwesomeLog.
 * The second argument is the log message you want to display.
 * All of the remaining arguments are extra details.  Depending on the formatter you are using, these may displayed differently. For example, if you use the `default` formatter, AwesomeLog will attempt to display printable versions of the remaining arguments; Errors in particular are formatted for easier reading.

## Log Levels

AwesomeLog starts with five basic Log Levels: Access, Error, Warn, Info, Debug by default). Each of these associated methods on the Log instance to allow you to easily use them.  So for the default levels you get
```
	Log.access(...)
	Log.error(...)
	Log.warn(...)
	Log.info(...)
	Log.debug(...)
```

If you customize the log levels, AwesomeLog will remove the default log level methods (`Log.warn()` etc) and replace them with methods that have your log levels names:

```
Log.init({
	levels: "silly,goofy,funny,bad"
});
Log.start()
Log.silly(...);
Log.goofy(...);
Log.funny(...);
Log.bad(...);
```

You may have as many Log Levels as you desire, but each must have a unique name.  Also, there are a handful of reserved words (anything that is already in the AwesomeLog class) and you cannot use them. These include: `AbstractLogWriter, AbstractLogFormatter, initialized, running, config, history, historySizeLimit, levels, levelNames, definedWriters, definedFormatters, defineWriter, defineFormatter, init, start, stop, pause, resume, clearHistory, getLevel, log, cpatureSubProcess, releaseSubProcess.`

In addition to the log level methods, you also use the `Log.log()` method which takes the level as the first argument, so you can programmatically set the level if needed.
```
	Log.log("level","system","message");
```

## Log Writers

A Log Writer is the channel by which a log message is written to some output device.  Writers are used to send the message to the console, the file system, a database, wherever you need your logs to end up.

AwesomeLog ships with three built-in Log Writers:

 - **Console**: Used to output log messages to the STDOUT console. Has the option to colorize output for ANSI compatible terminals.

 - **File**: Used to output log message to a given file. Has the capability to specify custom file names including date patterns, and support file rotation and cleanup.

 - **Null**: Used to output log messages to /dev/null and make them disappear forever.

By default AwesomeLog is configured to use the Console writer only. You can change the writers during your `Log.init()` call if you so desire. Here's an example:

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

This example enables two writers, a console writer and a file writer.

You can read more about [Configuration](./docs/Configuration), [Console Writer](./docs/ConsoleWriterConfiguration), or [File Writer](./docs/FileWriterConfiguration), or how to write your own [Custom Log Writer](./docs/LogWriters) in the respective documentation.

## Log Formatters

A Log Formatter takes the log message details (as well as a number of other system information details) and formats that into a single string message. Each Log Writer (see above) can have it's own Log Formatter.  If you do not provide a formatter, `default` is used.

AwesomeLog ships with four built-in Log Formatters:

 - **Default**: The default formatter outputs log messages in AwesomeLog's own custom format.  This includes the timestamp, the process id, the log level, the log system name, the log message, and any additional arguments.

	```
	2018-09-10T15:46:27.714Z : #1234 : INFO       : AwesomeLog       : Log initialized.
	2018-09-10T15:46:27.716Z : #1234 : INFO       : AwesomeLog       : Log started.
	```

 - **JSON**: The JSON formatter writes the entire log message out as a json string. You'll notice that there is a lot more detail in this example when compared with the one for `default` from above. Formatters often reduce the amount of log information.

	```
	{"hostname":"blah.awesomeeng.com","domain":"awesomeeng.com","servername":"blah","pid":1234,"ppid":5678,"main":"/code/project","arch":"x64","platform":"linux","bits":64,"cpus":8,"argv":"","execPath":"node","startingDirectory":"/code/project","homedir":"/home/blah","username":"blah","version":"v10.9.0","level":"INFO","system":"AwesomeLog","message":"Log initialized.","args":[],"timestamp":1536594573580}
	{"hostname":"blah.awesomeeng.com","domain":"awesomeeng.com","servername":"blah","pid":1234,"ppid":5678,"main":"/code/project","arch":"x64","platform":"linux","bits":64,"cpus":8,"argv":"","execPath":"node","startingDirectory":"/code/project","homedir":"/home/blah","username":"blah","version":"v10.9.0","level":"INFO","system":"AwesomeLog","message":"Log started.","args":[],"timestamp":1536594573582}
	```

 - **CSV**: The CSV formatter outputs the log information in a CSV format friendly to spreadsheets. The CSV format is `timestamp(unix epoch),level,pid,system name,message,arg0,arg1,...arg9999`.

 	```
	1536594995710,"INFO",19848,"AwesomeLog","Log initialized."
	1536594995712,"INFO",19848,"AwesomeLog","Log started."
	```

 - **JS**: The JS formatter outputs the log information as a JavaScript Object. It is more suited to programatic uses then to human readable usage.

	```
	[object Object]
	[object Object]
	```

You can read more about how to write your own [Custom Log Formatter](./docs/LogFormatters) in the documentation.


## Documentation

 - [Advanced Configuration](./docs/Configuration.md)
 - [Console Writer Configuration](./docs/ConsoleWriterConfiguration.md)
 - [File Writer Configuration](./docs/FileWriterConfiguration.md)
 - [Custom Log Levels](./docs/LogLevels.md)
 - [Custom Log Writers](./docs/LogWriters.md)
 - [Custom Log Formatters](./docs/LogFormatters.md)
 - [Working with Child Processes](./docs/ChildProcess.md)
 - [History](./docs/History.md)

 - [API Documentation](./docs/API.md)

## Examples

AwesomeLog ships with a set of examples for your reference.

 - [ExampleUsage](./examples/ExampleUsage): A basic example of how to use AwesomeLog.

 - [ExampleCustomWriter](./examples/ExampleCustomWriter): Illustrates how to build your own custom writer, should you need to do that.

 - [ExampleCustomFormatter](./examples/ExampleCustomFormatter): Provides a very basic example of building your own custom formatter.

 - [ExampleSubProcess](./examples/ExampleSubProcess): An example of using AwesomeLog with Child Processes.

## The Awesome Engineering Company

AwesomeLog is written and maintained by The Awesome Engineering Company. We belive in building clean, configurable, creative software for engineers and architects and customers.

To learn more about The Awesome Engineering Company and our suite of products, visit us on the web at https://awesomeeng.com.

## Support and Help

## License

AwesomeLog is released under the MIT License. Please read the  [LICENSE](https://raw.githubusercontent.com/awesomeeng/AwesomeLog/master/LICENSE?token=ABA2_wogpYds4a1qC_4aeUZd8C1in6Qcks5bUiQFwA%3D%3D) file for details.
