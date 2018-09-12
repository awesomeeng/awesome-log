## Classes

<dl>
<dt><a href="#AwesomeLog">AwesomeLog</a> ⇐ <code>Events</code></dt>
<dd><p>AwesomeLog is a singleton class that will always return a single AwesomeLog
instance each time it is required.</p>
</dd>
<dt><a href="#NullWriter">NullWriter</a> ⇐ <code>AbstractLogWriter</code></dt>
<dd><p>AbstractLogWriter to /dev/null</p>
</dd>
</dl>

<a name="AwesomeLog"></a>

## AwesomeLog ⇐ <code>Events</code>
AwesomeLog is a singleton class that will always return a single AwesomeLog
instance each time it is required.

**Kind**: global class  
**Extends**: <code>Events</code>  
**See**: [AwesomeLog README](../README.md) for usage details.  

* [AwesomeLog](#AwesomeLog) ⇐ <code>Events</code>
    * [new AwesomeLog()](#new_AwesomeLog_new)
    * [.AbstractLogWriter](#AwesomeLog+AbstractLogWriter) ⇒ <code>Class.&lt;AbstractLogWriter&gt;</code>
    * [.AbstractLogFormatter](#AwesomeLog+AbstractLogFormatter) ⇒ <code>Class.&lt;AbstractLogFormatter&gt;</code>
    * [.initialized](#AwesomeLog+initialized) ⇒ <code>boolean</code>
    * [.running](#AwesomeLog+running) ⇒ <code>boolean</code>
    * [.config](#AwesomeLog+config) ⇒ <code>Object</code>
    * [.history](#AwesomeLog+history) ⇒ <code>Array</code>
    * [.historySizeLimit](#AwesomeLog+historySizeLimit) ⇒ <code>number</code>
    * [.levels](#AwesomeLog+levels) ⇒ <code>Array.&lt;LogLevel&gt;</code>
    * [.levelNames](#AwesomeLog+levelNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [.definedWriters](#AwesomeLog+definedWriters) ⇒ <code>Array.&lt;string&gt;</code>
    * [.definedFormatters](#AwesomeLog+definedFormatters) ⇒ <code>Array.&lt;string&gt;</code>
    * [.defineFormatter(name, logFormatter)](#AwesomeLog+defineFormatter) ⇒ <code>void</code>
    * [.defineWriter(name, logWriter)](#AwesomeLog+defineWriter) ⇒ <code>void</code>
    * [.init(config)](#AwesomeLog+init) ⇒ <code>void</code>
    * [.start()](#AwesomeLog+start) ⇒ <code>void</code>
    * [.stop()](#AwesomeLog+stop) ⇒ <code>void</code>
    * [.pause()](#AwesomeLog+pause) ⇒ <code>void</code>
    * [.resume()](#AwesomeLog+resume) ⇒ <code>void</code>
    * [.clearHistory()](#AwesomeLog+clearHistory) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.getLevel(level)](#AwesomeLog+getLevel) ⇒ <code>LogLevel</code>
    * [.log(level, system, message, ...args)](#AwesomeLog+log) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.captureSubProcess(subprocess)](#AwesomeLog+captureSubProcess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.releaseSubProcess(subprocess)](#AwesomeLog+releaseSubProcess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)


* * *

<a name="new_AwesomeLog_new"></a>

### new AwesomeLog()
Construct a new AwesomeLog instance. This is only ever called once per application.


* * *

<a name="AwesomeLog+AbstractLogWriter"></a>

### awesomeLog.AbstractLogWriter ⇒ <code>Class.&lt;AbstractLogWriter&gt;</code>
Returns the AbstractLogWriter class for use in creating custom Log Writers.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+AbstractLogFormatter"></a>

### awesomeLog.AbstractLogFormatter ⇒ <code>Class.&lt;AbstractLogFormatter&gt;</code>
Returns the AbstractLogFormatter class for use in creating custom Log Formatters.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+initialized"></a>

### awesomeLog.initialized ⇒ <code>boolean</code>
Returns true if `Log.init()` has been called.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+running"></a>

### awesomeLog.running ⇒ <code>boolean</code>
Returns true if `Log.start()` has been called.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+config"></a>

### awesomeLog.config ⇒ <code>Object</code>
Returns the configuration used by `init()`. This is a merge of the default configuration
and the configuration passed into `init()`.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+history"></a>

### awesomeLog.history ⇒ <code>Array</code>
Returns an array of the last N (defined by `historySizeLimit`) log messages.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+historySizeLimit"></a>

### awesomeLog.historySizeLimit ⇒ <code>number</code>
Returns the maximum number of `history` entries. This is set via `init()`.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+levels"></a>

### awesomeLog.levels ⇒ <code>Array.&lt;LogLevel&gt;</code>
Returns an array of LogLevel objects for the currently configured levels. Levels
are configured via `init()`.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+levelNames"></a>

### awesomeLog.levelNames ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of strings containing the level names, as taken from the LogLevel
objects. Levels are configured via `init()`.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+definedWriters"></a>

### awesomeLog.definedWriters ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of strings containing the defined Log Writer names that can be used.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+definedFormatters"></a>

### awesomeLog.definedFormatters ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of strings containing the defined Log Formatter names that can be used.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+defineFormatter"></a>

### awesomeLog.defineFormatter(name, logFormatter) ⇒ <code>void</code>
Map a new Log Formatter to a specific name, for usage in configuring AwesomeLog.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| logFormatter | <code>Class.&lt;AbstractLogFormatter&gt;</code> | 


* * *

<a name="AwesomeLog+defineWriter"></a>

### awesomeLog.defineWriter(name, logWriter) ⇒ <code>void</code>
Map a new Log Writer to a specific name, for usage in configuring AwesomeLog.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| logWriter | <code>Class.&lt;AbstractLogWriter&gt;</code> | 


* * *

<a name="AwesomeLog+init"></a>

### awesomeLog.init(config) ⇒ <code>void</code>
Initializes AwesomeLog for usage. This should be called very early in your application,
in the entry point if possible.

You may only initialize if AwesomeLog is not running, which is done by calling
`start()`.

This method takes an optional configuration object. This configuration object is merged
with the default configuration to produce the overall configuration.  Below is the
default configuration values:

```
config = {
  history: true,
  historySizeLimit: 100,
  historyFormatter: "default",
  levels: "access,error,warn,info,debug",
  disableLoggingNotices: false, // true if this is a child process
  loggingNoticesLevel: "info",
  writers: [],
  backlogSizeLimit: 1000,
  disableSubProcesses: false
}
```

If no writers are provided, a default Console Writer is added to the configuration.

```
config.writes = [{
 name: "console",
 type:  "default", // "subprocess" if this is a child process
 levels: "*",
 formatter: default", // "subprocess" if this is a child process
 options: {}
}];
```

Initialization is responsible for taking the `config.levels` parameters,
transforming it into LogLevel objects, and ensuring that the log shortcut
methods are created. See also @see ./docs/LogLevels.md

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| config | <code>Object</code> \| <code>null</code> | 


* * *

<a name="AwesomeLog+start"></a>

### awesomeLog.start() ⇒ <code>void</code>
Starts AwesomeLog running and outputting log messages. This should be called
very early in your application, in the entry point if possible.

`startt()` is responsible for initializing the writers.

If any backlog messages exist when `start()` is called, they will be written
via the writers after they are started.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+stop"></a>

### awesomeLog.stop() ⇒ <code>void</code>
Stops AwesomeLog running. Once stopped AwesomeLog can be reconfigured via another
`init()` call.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+pause"></a>

### awesomeLog.pause() ⇒ <code>void</code>
Puts AwesomeLog into a paused state which prevents any log messages from being
written by the writers.  Log messages received while paused are stored in the
backlog and will be written when AwesomeLog is resumed.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+resume"></a>

### awesomeLog.resume() ⇒ <code>void</code>
Exits the paused state and writes out any backlog messages.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+clearHistory"></a>

### awesomeLog.clearHistory() ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Clears the stored `history` contents.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+getLevel"></a>

### awesomeLog.getLevel(level) ⇒ <code>LogLevel</code>
For any given level string, return the associated LogLevel object.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| <code>LogLevel</code> | 


* * *

<a name="AwesomeLog+log"></a>

### awesomeLog.log(level, system, message, ...args) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Log a single messages.

`log()` is called by all other shortcut log methods.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| <code>LogLevel</code> | 
| system | <code>string</code> \| <code>null</code> | 
| message | <code>string</code> | 
| ...args | <code>\*</code> | 


* * *

<a name="AwesomeLog+captureSubProcess"></a>

### awesomeLog.captureSubProcess(subprocess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Used when you create a new child process/cluster/worker thread if you intend AwesomeLog
to be used in the process/cluster/worker and want the log information consolidated
into a single AwesomeLog stream.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  
**See**: ./docs/ChildProcess.md  

| Param | Type |
| --- | --- |
| subprocess | <code>ChildProcess.ChildProcess</code> \| <code>Cluster.Worker</code> \| <code>WorkerThread.Worker</code> | 


* * *

<a name="AwesomeLog+releaseSubProcess"></a>

### awesomeLog.releaseSubProcess(subprocess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Stops capturing a process/cluster/worker log messages.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  
**See**: ./docs/ChildProcess.md  

| Param | Type |
| --- | --- |
| subprocess | <code>ChildProcess.ChildProcess</code> \| <code>Cluster.Worker</code> \| <code>WorkerThread.Worker</code> | 


* * *

<a name="NullWriter"></a>

## NullWriter ⇐ <code>AbstractLogWriter</code>
AbstractLogWriter to /dev/null

**Kind**: global class  
**Extends**: <code>AbstractLogWriter</code>  

* * *

