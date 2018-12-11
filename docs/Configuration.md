# [AwesomeLog](../README.md) > Configuration

When you initialize AwesomeLog via `Log.init()` you may provide an optional configuration object as the first argument.  This tells AwesomeLog how to work.

```
const Log = require("@awesomeeng/awesome-log");
Log.init({
	... your configuration goes here ...
});
```

## Configuration Options

The following configuration options are supported.

 - **levels** [string] - Details the Log Levels for this logging system. By default this is `"access,error,warn,info,debug"`.  Each level must be separated by a comma.

 - **writers** [array] - Describes what devices a log message is written to such as the console, a file, or a database.  Multiple writers are supported. If no writer is passed in, AwesomeLog will give you a default Console Writer.  See [Writer Configuration](#writer-configuration) below for more details.

 - **history** [boolean] - Set to false if you do not want AwesomeLog to keep a small history of log messages.  The history can be used for programatic access to the log. History is enabled by default. NOTE: Turning on history will impact your performance; if this is a concern, please disable history.

 - **histroySizeLimit** [number] - The number of log entries kept in the history. 1000 by default.

 - **historyFormatter** [string] - The formatter used when writing messages to the history. `default` is used by default. It should be noted that this formatter only applies to the history, not the writers.

 - **fields** [string] - A comma delimited string of the fields to include in each log entry. THe fields can be choen from the following:

   - **timestamp**: The current time, in UTC.
   - **level**: The log level for this particular log entry.
   - **text**: The text message for this particular log entry.
   - **args**: Any extra arguments passed to the log call.
   - **system**: The javascript file in which this log call was made. Please note that including this field is very expensive from a performance standpoint, and it should only be used in development systems.
   - **hostname**: The hostname of the machine the log event occured on. Good for integrated log systems.
   - **domain**: The domain name portion of the hostname, that is the last two segments of the hostname.
   - **servername**: The computer name for the machine the log event occured on. This is the first segment of the hostname.
   - **pid**: The process id for this log message. In subprocess systems this can be a valuable debugging tool.
   - **ppid**: The parent process id.
   - **main**: The path to the executed node executable.
   - **execpath**: The path to the executed node executable.
   - **argv**: The initial arguments passed to the executed node executable.
   - **arch**: The architecture value for the current OS.
   - **platform**: The platform value for the current OS.
   - **bits**: The bits value for the current OS.
   - **cpus**: The number of physical CPUs on the current machine.
   - **startingdir**: The starting directory of the node application.
   - **homedir**: The user's home directory.
   - **username**: The user's username.
   - **version**: The version of node.


 - **backlogSizeLimit** [number] - The number of log entries to hold pending being written.  If the backlog is exceeded, old messages will be dropped in favor of newer messages. This should be incredibly rare. 1000 is the default setting.

 - **disableLoggingNotices** [boolean] - If true, AwesomeLog will log out messages about the Log system such as when it is initialized, started, or stopped.  Set to false to stop this from happening.  True by default.

 - **loggingNoticesLevel** [string] - The Log Level used for AwesomeLog's Log Notices.  If you change your log levels it is recommended you change this as well if you want Log Notices.

 - **disableSubProcess** [boolean] - If true this will prevent child processes that create their own instance of AwesomeLog from sending messages to the parent process.  Defaults to false. See our [Child Process](./docs/ChildProcess.md) documentation for more details.

 - **scopeMap** [object] - Maps nested instance log levels to these log levels. Defaults to null. See our [Nested Usage](./docs/NestedUsage.md) documentation for more details.

 - **scopeCatchAll** [string] - The log level to map anything to that didn't correctly map with `scopeMap`. Defaults to "info". See our [Nested Usage](./docs/NestedUsage.md) documentation for more details.

Here is an example configuration using default values:

```
Log.init({
	levels: "access,error,warn,info,debug"
	writers: [{
		name: "MyConsoleWriter",
		type:  "console",
		levels: "*",
		formatter: "default",
		options: {}
	}],
	history: true,
	historySizeLimit: 1000,
	historyFormatter: "default",
	backlogSizeLimit: 1000,
	disableLoggingNotices: false,
	loggingNoticesLevel: "info"
	disableSubProcess: false,
	scopeMap: null,
	scopeCatchAll: "info"
});
```

## Writer Configuration

The configuration `writers` value takes an array of writer objects.  Each object represents one writer and its associated configuration. Each writer has the following configuration settings:

 - **name** [string] - A unique name for this writer. Required.

 - **type** [string] - The type of writer to use. Can be one of the following: `console`, `file`, `null` or your customer writer type. Required.

 - **levels** [string] - What levels are sent to this writer. This is a comma separated string (eg. `error,warn`). A string of `*` means all levels. If ommitted, `*` is assumed.

 - **formatter** [string] - The formatter to use for this writer. `default` if ommitted.  Can be one of the following: `default`, `json`, `csv`, `js`, or the name for your customer formatter.

 - **options** [Object] - An object that contains configuration information that is passed to the writer.  See [Console Writer Configuration](./docs/ConsoleWriterConfiguration) or [File Writer Configuration](./docs/FileWriterConfiguration) for more information.

## Formatter Configuration

Each writer has its own formatter setting. This allows each writer to output messages in its own format.

AwesomeLog ships with four built-in Log Formatters:

 - **Default**: The default formatter outputs log messages in AwesomeLog's own custom format.  This includes the timestamp, the process id, the log level, the log system name, the log message, and any additional arguments.

	```
	2018-09-10T15:46:27.714Z : #1234 : INFO       : AwesomeLog.js    : Log initialized.
	2018-09-10T15:46:27.716Z : #1234 : INFO       : AwesomeLog.js    : Log started.
	```

 - **JSON**: The JSON formatter writes the entire log message out as a json string. You'll notice that there is a lot more detail in this example when compared with the one for `default` from above. Formatters often reduce the amount of log information.

	```
	{"hostname":"blah.awesomeeng.com","domain":"awesomeeng.com","servername":"blah","pid":1234,"ppid":5678,"main":"/code/project","arch":"x64","platform":"linux","bits":64,"cpus":8,"argv":"","execPath":"node","startingDirectory":"/code/project","homedir":"/home/blah","username":"blah","version":"v10.9.0","level":"INFO","system":"AwesomeLog.js","message":"Log initialized.","args":[],"timestamp":1536594573580}
	{"hostname":"blah.awesomeeng.com","domain":"awesomeeng.com","servername":"blah","pid":1234,"ppid":5678,"main":"/code/project","arch":"x64","platform":"linux","bits":64,"cpus":8,"argv":"","execPath":"node","startingDirectory":"/code/project","homedir":"/home/blah","username":"blah","version":"v10.9.0","level":"INFO","system":"AwesomeLog.js","message":"Log started.","args":[],"timestamp":1536594573582}
	```

 - **CSV**: The CSV formatter outputs the log information in a CSV format friendly to spreadsheets. The CSV format is `timestamp(unix epoch),level,pid,system name,message,arg0,arg1,...arg9999`.

 	```
	1536594995710,"INFO",19848,"AwesomeLog.js","Log initialized."
	1536594995712,"INFO",19848,"AwesomeLog.js","Log started."
	```

 - **JS**: The JS formatter outputs the log information as a JavaScript Object. It is more suited to programatic uses then to human readable usage.

	```
	[object Object]
	[object Object]
	```

You can read more about how to write your own [Custom Log Formatter](./docs/LogFormatters) in the documentation.
