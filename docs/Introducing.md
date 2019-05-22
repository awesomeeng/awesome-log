# [AwesomeLog](../README.md) > Introducing AwesomeLog

AwesomeLog is a Log System for enterprise ready nodejs applications. It provides a basic out of the box logging solution that is ready to go with zero configuration but also gives you a highly configurable logging solution with the power to do your logging right.

In particular, AwesomeLog provides a fast, easy means to log data across your entire application, including child_processes/threads/clusters.  And it includes all the standard things like different formatters, different writers, colorized console logging, etc.

Using AwesomeLog is super simple, and fairly similar to other solutions, but also slightly different.  To get going quickly you just initialize it, and then start it.  Once started, AwesomeLog is globally available across your entire application.

```
2018-09-10T15:46:27.714Z : #1234 : INFO       : AwesomeLog.js    : Log initialized.
2018-09-10T15:46:27.716Z : #1234 : INFO       : AwesomeLog.js    : Log started.
```

## Key Features

 - **Zero Initial Configuration**. AwesomeLog requires zero configuration by default to get going.  But, if you want to do more with AwesomeLog, configuration options aplenty.

 - **Globally Available**. With AwesomeLog you configure and start once, usually at the top of your application, and then can use it anywhere without having to pass an object around.

 - **Custom Log Levels**. By default AwesomeLog has the standard ACCESS, ERROR, WARN, INFO, DEBUG log levels, but of course AwesomeLog allows you to change these to anything you want.

 - **Customizable Formatters**. Easily define how your log message look with customized formatters, or use one of the builtin formatters: Default, JSON, JS or CSV.  The Default formatter is AwesomeLog's personal favorite way of logging information.

 - **Customizable Writers**. Write log data to the console or file system easily, or provide your own customized log writter to send log data to, well, wherever.

 - **Colorized Console Logging**. Oooh. Pretty.

 - **Log History**. AwesomeLog maintains a history object allowing you to introspect log data and perform better testing.

 - **Pause/Resume**. Temporarily suspend logging with Pause and resume.

 - **SubProcess Logging**. Seemlessly configure sub-processes (aka child_process, worker threads, clusters) to forward log data to a master process, to create a consistent unified stream of log data across processes/threads/clusters.

 - **No External Dependencies**. AwesomeLog is written and maintained by The Awesome Engineering Company and has no dependency that was not written by us. This means consistency of code throughout the product and that we have zero dependencies that were not written inhouse.  This means safer code for you and your product.

 - **Free and Open**. AwesomeLog is released under the MIT licene and complete free to use and modify.

## Getting Started

AwesomeLog is super easy to use.

#### 1). Install It.

```shell
npm install @awesomeeng/awesome-log
```

#### 2). Require it.

```javascript
const Log = require("@awesomeeng/awesome-log");
```

#### 3). Configure it.

```javascript
Log.init({
	... configuration details ...
});
```

If you want to do things even faster, skip this step entirely and AwesomeLog will configure a default console writer out of the box and leave the harder configuration for another day.

AwesomeLog requires configuration and startup (below) only once for your entire application. Once it has occurred you can use AwesomeLog in any module without needing to pass the log object around.  Thus configuration and starting AwesomeLog should happen as close to the top of your application as possible.

#### 4). Start it.
```javascript
Log.start();
```

The `start()` method begins the logger writing and handling log messages.

#### 5). Use it.
```javascript
Log.debug("Hello world!");
Log.info("I'm a log message!");
```

Or use it in another module without needing to reinitialize it:

```javascript
const Log = require("@awesomeeng/awesome-log");
Log.info("Logged from another module!");
```

## Writers

Writers tell AwesomeLog where to write log messages out.

By default AwesomeLog supports three writers: Console, File, and Null.  The Console writer writes log message to the STDOUT console device.  The console writer can support things like colorizing log message and the like. The File writer writes log message to a file device, as specified in the configuration for that writer.  The File writer supports log message rotation and data based filenames. The Null writer writes log message to the /dev/null stream, essentially producing nothing.

Additionally you can create your own custom writer by extending AwesomeLog.AbstractWriter and registering the new writer with the `Log.defineWriter()` method.

AwesomeLog supports multiple writers of any type.

## Formatters

Formatters tell AwesomeLog what to write.  Each Writer has its own formatter.

AwesomeLog will record a bunch of different factors (also called fields) when you send a log message.  Each field can then be used or not when formatting the log message. It is the job of the formatter to determine what to write and how to format that message.

By default AwesomeLog ships with four formatters: Default, JSON, CSV, and JS.  The default formatter is AwesomeLog's custom format for log messages that includes the timestamp, process id, log level, system name, log message, and extra details.  The JSON formatter will include all fields in a standard JSON string format.  The CSV formatter includes timestamp (as a unix epoch), level, process id, system name, message, and extra details, in a CSV format for usage with a spreadsheet or like.  The JS format formats log message as a JavaScript object (specifically not JSON) for usage with internal writers like the history system.

## Documentation

That's the basics of AwesomeLog, but there is of course a lot more to it.

At this point, we suggest you check the [project readme](https://github.com/awesomeeng/awesome-log) out. Additionally there is specific documentation for Configuration, Console Writer, File Writer, Nested Usage, Custom Log Level, Custom Writers, Custom Formatters, etc.

 - [Read Me First!](https://github.com/awesomeeng/awesome-log)
 - [Advanced Configuration](https://github.com/awesomeeng/awesome-log/blob/master/docs/Configuration.md)
 - [Console Writer Configuration](https://github.com/awesomeeng/awesome-log/blob/master/docs/ConsoleWriterConfiguration.md)
 - [File Writer Configuration](https://github.com/awesomeeng/awesome-log/blob/master/docs/FileWriterConfiguration.md)
 - [Nested Usage](https://github.com/awesomeeng/awesome-log/blob/master/docs/NestedUsage.md)
 - [Custom Log Levels](https://github.com/awesomeeng/awesome-log/blob/master/docs/LogLevels.md)
 - [Custom Log Writers](https://github.com/awesomeeng/awesome-log/blob/master/docs/LogWriters.md)
 - [Custom Log Formatters](https://github.com/awesomeeng/awesome-log/blob/master/docs/LogFormatters.md)
 - [Working with Child Processes](https://github.com/awesomeeng/awesome-log/blob/master/docs/ChildProcess.md)
 - [History](https://github.com/awesomeeng/awesome-log/blob/master/docs/History.md)

## AwesomeStack

AwesomeStack is a free and open source set of libraries for rapidly building enterprise ready nodejs applications, of which, AwesomeLog is one part.  Each library is written to provide a stable, performant, part of your application stack that can be used on its own, or part of the greater AwesomeStack setup.

AwesomeStack includes...

 - **[AwesomeServer](https://github.com/awesomeeng/awesome-server)** - A http/https/http2 API Server focused on implementing API end points.

 - **[AwesomeLog](https://github.com/awesomeeng/awesome-log)** - Performant Logging for your application needs.

 - **[AwesomeConfig](https://github.com/awesomeeng/awesome-config)** - Powerful configuration for your application.

 - **[AwesomeCLI](https://github.com/awesomeeng/awesome-cli)** - Rapidly implement Command Line Interfaces (CLI) for your application.

All AwesomeStack libraries and AwesomeStack itself is completely free and open source (MIT license) and has zero external dependencies. This means you can have confidence in your stack and not spend time worrying about licensing and code changing out from under you. Additionally, AwesomeStack and all of is components are maintained by The Awesome Engineering Company ensuring you a single point of contact and responsibility and unified support for your entire application.

You can learn more about AwesomeStack here: https://github.com/awesomeeng/awesome-stack
