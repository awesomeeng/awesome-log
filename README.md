# AwesomeLog

AwesomeLog is a Log System for Enterprise Ready nodejs applications. It provides a basic out of the box Logging solution that is ready to go with zero configuration, or a highly configurable logging solution that gives you the power to do your logging right.

It's up to you.

## Features

AwesomeLog provides...
 - A Basic out of the box Logging solution that is ready to go with zero configuration, or a highly configurable logging solution that gives you the power to do your logging right. It's up to you.
 - Configure and start your AwesomeLog once, then use wherever.
 - Log Levels
   - Default Log Levels of Access, Error, Warn, Info and Debug.
   - Customizable Log Levels of any type you want.
 - Log Formatters to express how log message are output
   - Use one of our out of the box formatters: Default, JSON, JS Object, or CSV.
   - Or write your own custom Log Formatter.
 - Log Writers to tell your log how to output your messages
   - Use one of our out of the box formatters: Console, File
   - Or write your own custon Log Writer.
   - Each writer can have its own Log Formatter.
   - Each writer can display messages for all log levels, or limit to a specific set of log levels.
 - Colorized Console Logging
 - Log History for seeing a pre-defined number of previous log messages programatically.
 - Pause/Resume control over logging.
 - worker/child_process/cluster log captuiring.
 - Events for programatic notification of Log changes.
 - A Plugin system for writing and publishing custom Log Writers or Log Formatters.

## Why Another Log Solution?

AwesomeLog is similar to Winston, Log, Log4js, etc. and those are all good products.  AwesomeLog just provides a different method of Logging; one we think is cleaner and more stable. If you want to use Winston/Log/Log4js/whatever, that's perfectly fine by us. But if you want to try something a little cleaner, with a bit more features, consider AwesomeLog.

## Installation

Couldn't be easier.
```
	npm install @awesomeeng/AwesomeLog
```

## Setup

It is best if you configure AwesomeLog at the top of your application. We recommened you do this immediately near the top of your main node entry point.

Setup has three steps:

1). Require AwesomeLog...
```
	const Log = require("AwesomeLog");
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

That's it. AwesomeLog is running and you can now use it wherever.

## Usage

To use AwesomeLog once it is configured and started is simple:


1). You need to require AwesomeLog in any file/class that would reference it.

```
	const Log = require("AwesomeLog");
```

2). Then you just log stuff out.
```
	Log.info("system","message");
```

Simple.

## Log Methods

The log levels you configure (Access, Error, Warn, Info, Debug by default) all have associated methods on the Log instance to allow you to easily use them.  So for the default levels you end up with
```
	Log.access(...)
	Log.error(...)
	Log.warn(...)
	Log.info(...)
	Log.debug(...)
```

You may also use the `Log.log()` method which takes the level as the first argument, so you can programmatically use it.
```
	Log.log("level","system","message");
```

## Log Method Arguments

## Configuration

## Start/Stop/Pause/Resume

## Log History

## Log Writers

## Built In Log Writers

## Log Formatters

## Built In Log Formatters

## Writing a Custom Log Writer

## Writing a Custom Log Formatter

## The Awesome Engineering Company

AwesomeLog is written and maintained by The Awesome Engineering Company. We belive in building clean, configurable, creative software for engineers and architects and customers.

To learn more about The Awesome Engineering Company and our suite of products, visit us on the web at https://awesomeeng.com.

## Support and Help

## License

AwesomeLog is released under the MIT License. Please read the  [LICENSE](https://raw.githubusercontent.com/awesomeeng/AwesomeLog/master/LICENSE?token=ABA2_wogpYds4a1qC_4aeUZd8C1in6Qcks5bUiQFwA%3D%3D) file for details.
