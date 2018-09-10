# [AwesomeLog](../README.md) > Console Writer Configuration

The Console Writer outputs log message to the STDOUT (aka console). It is the default writer used if no `writers` configuration is passed into `Log.init()` before `Log.start()`. It can be used multiple times and in conjunction with other writers.

## Writer configuration

To configure a the Console Writer with custom settings you need to pass a configruation as a value in `writers` when you execute `Log.init()`, as shown here:

```
Log.init({
	writers: [{
		name: "MyConsoleWriter",
		type:  "console",
		levels: "*",
		formatter: "default",
		options: {
		}
	}]
});
```

The following settings are applicable:

 - **name** [string] - A unique name for this writer. Required. You may change this to anything you like in the above example.

 - **type** [string] - The type of writer to use. Must be `console` for the Console Writer. Required.

 - **levels** [string] - What levels are sent to this writer. This is a comma separated string (eg. `error,warn`). A string of `*` means all levels. If ommitted, `*` is assumed.

 - **formatter** [string] - The formatter to use for this writer. `default` if ommitted.  Can be one of the following: `default`, `json`, `csv`, `js`, or the name for your customer formatter.

 - **options** [Object] - An object that contains configuration information that is passed to the Console Writer.  See the [next section](#console-writer-options) for details.

## Console Writer Options

The options argument of the Console Writer configuration can have the following additional configuration settings.

 - **colorize** [boolean] - True if you want to output ANSI colors in your log messages. Set to false to turn off colorization.  True by default.

 - **colorStyle** [string] - May be either `level` or `line`. `level` style means that only the Log Level string in the log message text is colorized.  `line` means that the entire line is colorized.  `level` is the default.

 - **colors** [Object] - A map of Log Levels to colors.  If you provide custom Log Levels or you want different colors, you will need to provide a custom map of colors.  The possible color values are `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `brightblack`, `brightred`, `brightgreen`, `brightyellow`, `brightblue`, `brightmagenta`, `brightcyan`, or `brightwhite`. [Color Examples](https://en.wikipedia.org/wiki/ANSI_escape_code#Colors)

	```
	colors: {
		ACCESS: "green",
		ERROR: "red",
		WARN: "yellow",
		INFO: "magenta",
		DEBUG: "cyan",
	}
	```


## The Default Console Writer

By default AwesomeLog is configured to use a default Console Writer. Here is that configuration:

```
Log.init({
	writers: [{
		name: "MyConsoleWriter",
		type:  "console",
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
