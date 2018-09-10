# [AwesomeLog](../README.md) > File Writer Configuration

The File Writer outputs log message to a given file or file pattern. It is an additional writer used if no `writers` configuration is passed into `Log.init()` before `Log.start()`. It can be used multiple times and in conjunction with other writers.

## Writer configuration

To configure a the File Writer with custom settings you need to pass a configruation as a value in `writers` when you execute `Log.init()`, as shown here:

```
Log.init({
	writers: [{
		name: "MyFileWriter",
		type:  "file",
		levels: "*",
		formatter: "default",
		options: {
		}
	}]
});
```

The following settings are applicable:

 - **name** [string] - A unique name for this writer. Required. You may change this to anything you like in the above example.

 - **type** [string] - The type of writer to use. Must be `file` for the File Writer. Required.

 - **levels** [string] - What levels are sent to this writer. This is a comma separated string (eg. `error,warn`). A string of `*` means all levels. If ommitted, `*` is assumed.

 - **formatter** [string] - The formatter to use for this writer. `default` if ommitted.  Can be one of the following: `default`, `json`, `csv`, `js`, or the name for your customer formatter.

 - **options** [Object] - An object that contains configuration information that is passed to the File Writer.  See the [next section](#file-writer-options) for details.

## File Writer Options

The options argument of the File Writer configuration can have the following additional configuration settings.

 - **filename** [boolean] - The filename or filename pattern to which to write. This may either be a specific filename or a filename pattern based on the date to create rolling logs. If no value is provided, the default value is `logs/AwesomeLog.{YYYYMMDD}.log`.  Filenames are always resolved relative to the current working directory.  See the section below [Filenames and Filename Patterns](#filesnames-and-filename-patterns) for more details.

 - **housekeeping** [boolean|number] - This may either be `false` or a number. The number represent how long, in milliseconds, old log files should be retained once they are no longer being written.  Housekeeping runs whenever the filename is changed due to a changing pattern or restarting the application.  This is `false` by default and housekeeping needs to be opted-in.

## Filenames and Filename Patterns

When providing the filename argument you have two choices for the value you provide: A filename or a filename pattern.

 **Filenames** will write log details to a single filename, always appending. The file will continually grow until some external mechanism removes the filename from the system.

 Filenames can be used in conjuction with housekeeping, but it is probably not the best idea, and only so long as the underlying application is stopped periodically. Housekeeping only runs when the system is started or stopped.

 - **Filename Patterns** are the more versitile approach and provide for more flexibility with your log files.  A filename pattern is defined as a filename string that contains a date replacement pattern of the form `{YYYYMMDD}` where `YYYYMMDD` is the date pattern you want replaced.

 When your log messages are being written out, the pattern for each message is computed with the timestamp of the log message. The resulting filename is the location of where the system will write the log message.

 You can use the following symbols in your pattern string and they will be replaced as described:

	| Pattern | Substitution                             | Example against July 20, 1969, 20:18:04.017 UTC |
	|---------|------------------------------------------|-------------------------------------------------|
 	| YY      | 2 digit year.                            | 69                                              |
 	| YYYY    | 4 digit year.                            | 1969                                            |
 	| M       | numeric month, not zero filled.          | 7                                               |
 	| MM      | numeric month, zero filled.              | 07                                              |
 	| MMM     | shortened 3 character month name.        | Jul                                             |
 	| MMMM    | full month name                          | July                                            |
 	| D       | numeric day of month, not zero filled.   | 20                                              |
 	| DD      | numeric day of month, zero filled.       | 20                                              |
 	| DDD     | numeric day of year, not zero filled.    | 200                                             |
 	| DDDD    | numeric day of year, zero filled.        | 200                                             |
 	| d       | numeric day of the week (0=sunday).      | 0                                               |
 	| dd      | shortened 2 character day of the week    | Su                                              |
 	| ddd     | shortened 3 character day of the week    | Sun                                             |
 	| dddd    | full textual day of the week             | Sunday                                          |
 	| A       | AM or PM.                                | PM                                              |
 	| a       | am or pm.                                | pm                                              |
 	| H       | 24 0 based hour of day, not zero filled. | 20                                              |
 	| HH      | 24 0 based hour of day, zero filled.     | 20                                              |
 	| h       | 12 hour of day, not zero filled.         | 8                                               |
 	| hh      | 12 hour of day, zero filled.             | 8                                               |
 	| k       | 24 1 based hour of day, not zero filled. | 21                                              |
 	| kk      | 24 1 based hour of day, zero filled.     | 21                                              |
 	| m       | minute of hour, not zero filled.         | 18                                              |
 	| mm      | minute of hour, zero filled.             | 18                                              |
 	| s       | second of minute, not zero filled.       | 4                                               |
 	| ss      | second of minute, zero filled.           | 04                                              |
 	| S       | milliseconds of second, not zero filled. | 17                                              |
 	| SSS     | milliseconds of second, zero filled.     | 017                                             |
 	| z       | textual time zone                        | UTC                                             |
 	| Z       | relative time zone with separator        | -00:00                                          |
 	| ZZ      | relative time zone without separator     | -0000                                           |
 	| X       | unix timestamp (seconds)                 | -14182916                                       |
 	| x       | unix timestamp (milliseconds)            | -14182916000                                    |

 You may have multiple patterns in a filename pattern string, for example: `/logs/{YYYY}/{MM}/{DD}/MyLog.{HH}.log`

## Some Helpful Housekeeping Values

 - **3600000** - 1 hour
 - **7200000** - 2 hours
 - **21600000** - 6 hours
 - **43200000** - 12 hours
 - **64800000** - 18 hours
 - **86400000** - 1 day
 - **172800000** - 2 days
 - **259200000** - 3 days
 - **604800000** - 7 days
 - **1209600000** - 14 days
 - **2592000000** - 30 days
 - **5184000000** - 60 days
 - **7776000000** - 90 days
 - **15552000000** 180 days
 - **31536000000** 365 days
 -
