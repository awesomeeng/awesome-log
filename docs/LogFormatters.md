# [AwesomeLog](../README.md) > Log Formatters

A Log Formatter is responsible for taking a raw log entry object and converting it into a string log message, which a Log Writer can output.  Each Log Writer can have its own Log Formatter allowing different writers to produce different formatted messages.

## Using Log Formatters

Log Formatters are configured against a specific Log Writer when you configure the Log Writer itself.  Here's an example:

```
Log.init({
	writers: [{
		name: "MyFileWriter",
		type:  "file",
		levels: "*",
		formatter: "json",
		options: {
		}
		formatterOptions: {			
		}
	}]
});
```

In this case we are telling our File Writer to use the `json` formatter.

## Built-In Log Formatters

AwesomeLog ships with four built-in Log Formatters:

 - **Default**: The default formatter outputs log messages in AwesomeLog's own custom format.  This includes the timestamp, the process id, the log level, the log system name, the log message, and any additional arguments.

	```
	2018-09-10T15:46:27.714Z : #1234 : INFO       : AwesomeLog       : Log initialized.
	2018-09-10T15:46:27.716Z : #1234 : INFO       : AwesomeLog       : Log started.
	```

	The default formatter may take the following options:

	- **oneline**: If true all the text output for a single log entry is kept to a single line in the log. If false, 
	arguments to a log entry beyond the initial message are spread across multiple lines. This is false by default.

 - **JSON**: The JSON formatter writes the entire log message out as a json string. You'll notice that there is a lot more detail in this example when compared with the one for `default` from above. Formatters often reduce the amount of log information.

	```
	{"hostname":"blah.awesomeeng.com","domain":"awesomeeng.com","servername":"blah","pid":1234,"ppid":5678,"main":"/code/project","arch":"x64","platform":"linux","bits":64,"cpus":8,"argv":"","execPath":"node","startingDirectory":"/code/project","homedir":"/home/blah","username":"blah","version":"v10.9.0","level":"INFO","system":"AwesomeLog","message":"Log initialized.","args":[],"timestamp":1536594573580}
	{"hostname":"blah.awesomeeng.com","domain":"awesomeeng.com","servername":"blah","pid":1234,"ppid":5678,"main":"/code/project","arch":"x64","platform":"linux","bits":64,"cpus":8,"argv":"","execPath":"node","startingDirectory":"/code/project","homedir":"/home/blah","username":"blah","version":"v10.9.0","level":"INFO","system":"AwesomeLog","message":"Log started.","args":[],"timestamp":1536594573582}
	```

	The JSON formatter supports the following formatter options:

	- **alias**: An object that allows you to alias log entry data under a different key. That is
	you create a copy from one logentry key into a new logentry key. You must supply
	the new key as the key in the object, and to origin key as the value. You may
	not overwrite an existing logentry key. Defined as `alias: { aliasName: "originalKey" }`

	- **move**: Similar to alias, except this will remove the original key from logentry after moving the value.
	All the same rules from alias apply. Defined as `move: { moveTo: "originalKey" }`

	- **oneline**: This will ensure that the logentry.text value includes the logentry.args values in a single line
	of text. This is similar to the Default formatter's oneline formatter option.

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

## Formatters and Fields

In your `Log.init()` you may specify a `fields` configuration property which determines what fields are popualted into each log entry.  However, the Log Formatter you choose is not under any obligation to display all of the fields in a Log Entry.  Some formatters may limit the set of shown fields intentionally.  In particular, the Default formatter limits field output to `timestamp,pid,level,system,text,args`.  Please see the [Configuration documentation](./docs/Configuration.md) for more details aboutt the `fields` configuration property.

## Writing a Custom Log Formatter

AwesomeLog strives to be highly configurable. As such, you are completely able to add your own formatters to AwesomeLog.

A custom formatter has the following shape, taken from our example [ExampleCustomFormatter](./examples/ExampleCustomFormatter) class:

```
"use strict";

const Log = require("@awesomeeng/awesome-log");
const AbstractLogFormatter = Log.AbstractLogFormatter;

class MyExampleFormatter extends AbstractLogFormatter {
	constructor(parent) {
		super(parent);
	}

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

module.exports = MyExampleFormatter;

Log.defineFormatter("my-example-formatter",module.filename);
```

First, we require `AwesomeLog` and `AwesomeLog.AbstractLogFormatter`.

Next, we create our `MyExampleLogFormatter` class by extending `AbstractLogFormatter`.

In our class we are required to implement two methods:

 - **`constructor()`**: Where you can do some early initialization as required.

 - **`format(logentry)`**: The `format(logentry)` gets a `logentry` object that has a number of [different keys](#log-entry-keys) about the log message.  It returns a string (or otherwise) formatted message, like in our example.

Finally, once our new LogFormatter class is set, we call `defineFormatter(typeName,logFormatterFilename)` to tell AwesomeLog about it.  `defineFormatter(formatterName,logFormatterFilename)` take two arguments, the first the `formatterName` is the string value to be used to reference the formatter in the `formatter` setting, and second the `logFormatterFilename` is the filename of the exported formatter class we just defined (not an instance of the class) to call when the formatter is used.

After `defineFormatter` is called, one can use the writer in `Log.init()`.

## Log Entry Keys

Each Log Entry that a formatter receives an object with a dozen or so key/values in it. These properties are dicated by your `log.init()` `fields` setting.

Below is a list of the possible provided:

 - **timestamp**: The time (unix epoch) this log message wasa generated.
 - **level**: The Log Level of this log message. (This may be a Log Level object or a string.)
 - **system**: The System that was passed to the log message call, or the source file it was called from.
 - **text**: The log text itself.
 - **args**: Any addition log message arguments passed in.<br/><br/>
 - **hostname**: The FQDN hostname of the machine.
 - **domain**: The domain name (last two segments of the FQDN).
 - **servername**: The server name (the first segment of the FQDN).
 - **pid**: The process id.
 - **ppid**: The parent process id.
 - **main**: The main nodejs script that was executed when nodejs was started, if any.
 - **arch**: The hardware architecture. See nodejs' `os.arch()`.
 - **platform**: The OS platform. See nodejs' `os.platform()`.
 - **bits**: The OS bits, extrapolated from the OS platform.
 - **cpus**: The number of CPUs in the system.
 - **argv**: The original argv command line arguments passed when nodejs was started.
 - **execPath**: The executable to nodejs.
 - **startingDirectory**: The starting current working directory. This is not the same as the current working directory as the current working directory can change during execution.
 - **homedir**: The user's home directory.
 - **username**: The user's username, if any.
 - **version**: The nodejs version string.

## Log Formatter Options

Some formatters can take additional options which can be configured by setting the `formatterOptions` option for the writer.  The default formatter, for example, can take additional options.