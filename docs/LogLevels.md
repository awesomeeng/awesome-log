# [AwesomeLog](../README.md) > Log Levels

Log Levels are the various levels of log information you can report in your application. AwesomeLog ships with a default set of Log Levels, but you can easily customize these to meet your needs.

## Log Levels Methods

When AwesomeLog is initialized via `Log.init()` it will create a bunch of shortcut methods to ease your logging usage.  These levels come in three flavors, but they all get to the same place.  It creates an all lowercase version, an all uppercase version, and a version with the first character uppercased and the remaining characters lowercased.

For example, if you set a log level called `blah`, AwesomeLog will create shortcut methods called `blah()`, `BLAH()` and `Blah()`.

This allows your to use whichever log method style you prefer.

## Default Log Levels

AwesomeLog starts with five basic Log Levels: `Access`, `Error`, `Warn`, `Info`, `Debug` by default. In accordance with the previous section this means the following methods are available:

```
Log.access(...)
Log.error(...)
Log.warn(...)
Log.info(...)
Log.debug(...)

Log.ACCESS(...)
Log.ERROR(...)
Log.WARN(...)
Log.INFO(...)
Log.DEBUG(...)

Log.Access(...)
Log.Error(...)
Log.Warn(...)
Log.Info(...)
Log.Debug(...)
```

## Customizing

AwesomeLog support changing the log levels for any given application. This is done in the `Log.init()` configuration. If you customize the log levels, AwesomeLog will remove the default log level methods (`Log.warn()` etc) and replace them with methods that have your log levels names:

```
Log.init({
	levels: "silly,goofy,funny,bad"
});
Log.start()

Log.silly(...);
Log.goofy(...);
Log.funny(...);
Log.bad(...);

Log.SILLY(...);
Log.GOOFY(...);
Log.FUNNY(...);
Log.BAD(...);

Log.Silly(...);
Log.Goofy(...);
Log.Funny(...);
Log.Bad(...);
```

You may have as many Log Levels as you desire, but each must have a unique name.  Also, there are a handful of reserved words (anything that is already in the AwesomeLog class) and you cannot use them. These include: `AbstractLogWriter, AbstractLogFormatter, initialized, running, config, history, historySizeLimit, levels, levelNames, definedWriters, definedFormatters, defineWriter, defineFormatter, init, start, stop, pause, resume, clearHistory, getLevel, log, cpatureSubProcess, releaseSubProcess.`

## Other Impacts

Changing the custom log levels can have implications on a few other parts of the configuration and should be accounted for.

#### Logging Notices

Logging Notices are log messages that AwesomeLog sends as part of its operation.  They can be disabled via [configuration](./docs/Configuration.md) property `disableLoggingNotices`. However, if they are not and you are using custom Log levels, make sure to change the `loggingNoticesLevel` to be the appropraite custom log level for these notices, whatever you decided that is.

#### Log Writers

If your Log Writer [configuration](./docs/Configuration.md) refers to the default Log Levels, in its `levels` property, you should change it to reflect your new custom log levels.

#### Console Writer Colors

The [Console Writer colorization feature](./docs/ConsoleWriterConfiguration.md) requires a map from Log Levels to colors.  This is set in the Console Writer `options` property. Here's an example:

```
colors: {
	ACCESS: "green",
	ERROR: "red",
	WARN: "yellow",
	INFO: "magenta",
	DEBUG: "cyan",
}
```

## Child Processes

If you are using the [AwesomeLog with Child Processes](./docs/ChildProcess.md), please be aware that the `levels` configuration property for the Child Process must match that of its parent process.
