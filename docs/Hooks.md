# [AwesomeLog](../README.md) > Hooks

AwesomeLog (as of version 4.1.0) allows developers to tap into a number of its process hook and execute code when certain AwesomeLog lifecycle events happen. In some cases this allows developers to mutate the LogEntry object (that describes each log action) in whatever way they wish. This should be done carefully and using hooks is not a replacement for implementing a [Custom Log Formatter](./LogFormatters) or a [Custom Log Writer](./LogWriters).

## AwesomeLog Lifecycle

AwesomeLog has two lifecycles: The AwesomeLog Service Lifecycle and the AwesomeLog Log Lifecycle.

The Service Lifecycle occurs as AwesomeLog is initialized and started and stopped and has to do with how AwesomeLog is executed as a whole. It has the following flow:

 - Initialization
 - Start
   - **beforeStart hook**
   - *Start occurs*
   - **afterStart hook**
 - Stop
   - **beforeStop hook**
   - *Stop occurs*
   - **afterStop hook**

The Log Lifecycle occurs every time something is logged through AwesomeLog via the `Log.xyz` (`Log.info` for example) calls.  This lifecycle has the following flow:

 - Log called
   - **beforeLog hook**
   - *get associated Level Object*
   - *initial LogEntry created*
   - **beforeLogEntry hook**
   - *populate LogEntry*
   - **afterLogEntry hook**
   - **beforeWrite hook**
   - *history updated*
   - *write*
   - **afterWrite hook**
   - **afterLog hook**

## Using Hooks

Hooks are configured by providing a Function to the appropriate hook field in the configuration `.hooks` object. For example:

```
const Log = require("../src/AwesomeLog");
Log.init({
	disableLoggingNotices: true,
	hooks: {
		beforeLogEntry: (logEntry) => { ... do you hook work here ... }
	}
});
```

## Provided Hooks

 - **beforeStart** [Function] - If provided, this hook will be executed prior to AwesomeLog being started. The given function is called with the a reference to AwesomeLog as its sole argument.

 - **afterStart** [Function] - If provided, this hook will be executed after AwesomeLog is started. The given function is called with the a reference to AwesomeLog as its sole argument.

 - **beforeStop** [Function] - If provided, this hook will be executed prior to AwesomeLog being stopped. The given function is called with the a reference to AwesomeLog as its sole argument.

 - **afterStop** [Function] - If provided, this hook will be executed after AwesomeLog is stopped. The given function is called with the a reference to AwesomeLog as its sole argument.

 - **beforeLog** [Function] - If provided, this hook will be executed before every logging call to AwesomeLog. The given function is called with the the same arguments provided to the log call, namely `(level, text, ...args)`.

 - **afterLog** [Function] - If provided, this hook will be executed after every logging call to AwesomeLog. The given function is called with the the same arguments provided to the log call, namely `(level, text, ...args)`.

 - **beforeLogEntry** [Function] - If provided, this hook will be executed before every logging call generates its LogEntry object. The given function is called with the logEntry object as its sole argument. The logEntry object can be mutated but not replaced at this point in time.

 - **afterLogEntry** [Function] - If provided, this hook will be executed after every logging call generates its LogEntry object. The given function is called with the logEntry object as its sole argument. The logEntry object can be mutated but not replaced at this point in time.

 - **beforeWrite** [Function] - If provided, this hook will be executed before every logging call performs its write operation. The write operation of a log call differs depending on whether or not sub-processes are being used and whether or not writers are being run in separate threads. The given function is called with the logEntry object as its sole argument. The logEntry object can be mutated but not replaced at this point in time.

 - **afterWrite** [Function] - If provided, this hook will be executed before every logging call performs its write operation. The write operation of a log call differs depending on whether or not sub-processes are being used and whether or not writers are being run in separate threads. The given function is called with the logEntry object as its sole argument. The logEntry object **cannot** be mutated at this point in time as it is already written.

## An Example Usage

The following example hooks into the `beforeLogEntry` hook and allows the developer to provide additional properties in the LogEntry which might not have been there otherwise. Please note that while this does mutate LogEntry, not all formatters are configured to handle arbitrary LogEntry properties; The Default Formatter, for example, will not output arbitrary Log Entry properties, but the JSON Formatter will.

```
const beforeLogEntryHook = (entry) => {
	entry.projectId = "4356DFB346yh363423345hetds34ff25445";
};

const Log = require("../src/AwesomeLog");
Log.init({
	fields: "timestamp,level,text,projectId,args",
	hooks: {
		beforeLogEntry: beforeLogEntryHook 
	}
});
```
