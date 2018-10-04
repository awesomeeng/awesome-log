# [AwesomeLog](../README.md) > Nested Usage

AwesomeLog has the ability to be used in multiple modules without minimal conflicts; a feature we call Nested Usage.  Nested Usage solves the problem of what happens when module X wants to use AwesomeLog, but your own module Y wants to use it as well.

## Setup

Scope is enabled by default in AwesomeLog. Every time you call the `Log.init()` method, it handles the nested usage case automatically. It does so with the following rules in mind...

First, the first module to call `Log.init()` in your program is the root instance of AwesomeLog.  The root instance is the only instance that outputs any log messages to its writers. This is why it is critical to place your `Log.init()` as early in your application as possible.

Second, any subsequent call to AwesomeLog in your program is a nested instance.  When you `Log.init()` a nested instance it maps the log levels of the nested instance to the log levels of the root instance as decribed in `scopeMap` and `scopeCatchAll` (see below).  Thus any log messages written to a log level that your nested instance might use are transformed into the root instance log level and then written by the root instance.

Third, nested instance writers are never started, only the root instance writers get started and used. This means module writers that you import/require dont generate logs unless they are

## Scope Mapping

Whenever a nested instance is used, AwesomeLog will attempt to map the nested instance log levels to the root instance log levels.  It does this in three possible ways:

You may add a `scopeMap` property to your `log.init()` configuration that maps nested log level names to root log level names.  Here's an example.

```
Log.init({
	... your config ...
	scopeMap: {
		critical: "error",
		severe: "warn",
		noteworthy: "info"
	}
});
```

Also, you may supply a `scopeCatchAll` property to your `log.init()` configuration that, if a log level is not mapped in the `scopeMap` setting, the `scopeCatchAll` level will be used instead.  By default `scopeCatchAll` is set to `INFO`.

```
Log.init({
	... your config ...
	scopeMap: {
		critical: "error",
		severe: "warn",
		noteworthy: "info"
	},
	scopeCatchAll: "debug"
});
```
