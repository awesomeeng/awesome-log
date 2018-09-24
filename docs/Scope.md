# [AwesomeLog](../README.md) > Scope

AwesomeLog has the ability to be used in multiple modules without conflicting with one another; a feature we call Scope.  Scope solves the problem of what happens when module X wants to use AwesomeLog, but your own module Y wants to use it as well.  Scope contains AwesomeLog behaviors within the module that initialized it, allowing AwesomeLog to handle messages logged in other scopes more appropriately. Scope can surpress the log messages in module X from flowing into module Y.  Or, if you prefer, Scope can be used to rewrite log levels from module X into log levels that fit Module Y. Win win for everyone.

## Setup

Scope is enabled by default in AwesomeLog. Every time you call the `Log.init()` method, it creates a scoped instance of AwesomeLog.

A scoped instance does two things:

First, only the initial call to `Log.init()`, which we will call the Primary Scoped Instance, will have writers. Additional calls to `Log.init()` (in another module perhaps) will have their writers ignored.

Second, every time a log message is sent the scoped instance is determined. If the message was sent to the Primary Scoped Instance, those messages are treated as normal.  If the message was sent to any other scoped instance, instead of writing the message, it will rewrite the Log Level of the message and forward it to the Primary Scoped Instance. The rewriting of the Log Level is important because it allows the Primary Scoped Instance to understand the log message and decide how to write it; this is called Scope Mapping and we will talk about that in just a minute.

Consider the following:

```
                     +-----------------------+
                     |	 MAIN Application    |
                     +-----------------------+
                            /         \
						   /           \
                       requires      requires
					     /               \
                        /                 \
	      +----------------+           +----------------+
	      |	  Module AAA   |           |   Module BBB   |
	      +----------------+           +----------------+
		  		                                    \
													 \
												   requires
													   \
												  +----------------+
											 	  |	  Module CCC   |
											 	  +----------------+
```

Scenario 1: If we call `Log.init()` in **MAIN Application** Module AAA, Module BBB and Module CCC will all use the same Scope; all they need do is `require` AwesomeLog and call `Log.debug()` (or the like).

Scenario 2: If we call `Log.init()` in **MAIN Application** and also call it in **Module BBB** MAIN Application and Module AAA will use the MAIN Application Scope, and Module BBB and Module CCC will use the Module BBB scope.

## Scope Mapping

In scenario 2 above, when a message is logged in Module CCC, the Module BBB scope receives the message. If MAIN Application Scope and Module BBB Scope have different log levels we need some facility to transform Module BBB Scope Log Levels into MAIN Application Scope Log Levels.  This is done using the `scopeMap` configuration parameter passed to `Log.init()`.  The scope map is a plain javascript object that maps a higher level (Module BBB Scope) to a lower level (MAIN Application Scope). For example, if MAIN Application used the default Log Levels (`access`, `error`, `warn`, `info`, and `debug`) and if Module BBB had the Log Levels `Critical`, `Severe`, and `Noteworthy`, our `scopeMap` in MAIN Application might look like this:

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

Thus when we call `Log.Severe()` in Module CCC, it will get handled by the Module BBB Scope, which rewrites `Severe` to `warn` and forwards it to MAIN Application Scope for writing out.

It is useful to note that if MAIN Application Scope and Module BBB Scope have the same Log Levels, these will pass straight through without additional mapping.

## Catch All

In addition to the `scopeMap` it is possible to define `scopeCatchAll`. In the event that `scopeMap` did not map a Log Level, the value given to `scopeCatchAll` will be used.  So from our above `scopeMap` example:

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

`scopeCatchAll` defaults to "info" if not given.

## Disabling Module Writes

In some situations it may be desirable to not map lower scopes or otherwise to prevent lower scopes from writing at all.  This can be done on a log level basis or a global basis:

Setting `scopeCatchAll` to `null` will cause all lower scoped messages to be discarded.

Setting `null` in your `scopeMap` for a given Log Level will cause just that level to be discarded.
```
Log.init({
	... your config ...
	scopeMap: {
		critical: "error",
		severe: null,
		noteworthy: "info"
	},
	scopeCatchAll: "debug"
});
```
