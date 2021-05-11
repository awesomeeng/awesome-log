## Classes

<dl>
<dt><a href="#AwesomeLog">AwesomeLog</a></dt>
<dd><p>AwesomeLog is a singleton object returned when you
<code>const Log = require(&quot;@awesomeeng/awesome-log&quot;)</code>. From it you
can initialize and start your log service and then begin writing
log messages out. Please see our
<a href="../README.md">extensive documentation</a> for usage details.</p>
</dd>
<dt><a href="#LogLevel">LogLevel</a></dt>
<dd><p>Class for holding LogLevel names and their associated needs.</p>
<p>See our <a href="./docs/LogLevels.md">Log Levels</a> documentation for more detials.</p>
</dd>
</dl>

## Interfaces

<dl>
<dt><a href="#AbstractLogFormatter">AbstractLogFormatter</a></dt>
<dd><p>Constructor for a Log Formatter.</p>
<p>It is important to note that this constructor is never called by you, but
is instead called by AwesomeLog when the <code>start()</code> command is issued.</p>
<p>Your class must call this as shown here:</p>
<pre><code>class MyFormatter extends AbstractLogFormatter {
     constructor(options) {
       super(options);

       ... your initialization code ...
     }
}
</code></pre>
<p>Failure to not do the super constructor will result in errors.</p>
<p>You should put any kind of initialization of your formatter in this constructor.</p>
</dd>
<dt><a href="#AbstractLogWriter">AbstractLogWriter</a></dt>
<dd><p>Constructor for a Log Writer.</p>
<p>It is important to note that this constructor is never called by you, but
is instead called by AwesomeLog when the <code>start()</code> command is issued.</p>
<p>Your class must call this as shown here:</p>
<pre><code>class MyWriter extends AbstractLogWriter {
     constructor(options) {
       super(options);

       ... your initialization code ...
     }
}
</code></pre>
<p>Failure to not do the super constructor will result in errors.</p>
<p>You should put any kind of initialization of your writer in this constructor.</p>
</dd>
</dl>

<a name="AbstractLogFormatter"></a>

## AbstractLogFormatter
Constructor for a Log Formatter.

It is important to note that this constructor is never called by you, but
is instead called by AwesomeLog when the `start()` command is issued.

Your class must call this as shown here:

```
class MyFormatter extends AbstractLogFormatter {
	 constructor(options) {
	   super(options);

	   ... your initialization code ...
	 }
}
```

Failure to not do the super constructor will result in errors.

You should put any kind of initialization of your formatter in this constructor.

**Kind**: global interface  
**See**: [Log Writer](./docs/LogFormatters.md) documentation for more details.  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 


* [AbstractLogFormatter](#AbstractLogFormatter)
    * [.options](#AbstractLogFormatter+options) ⇒ <code>Object</code>
    * [.format(logentry)](#AbstractLogFormatter+format) ⇒ <code>Object</code>


* * *

<a name="AbstractLogFormatter+options"></a>

### abstractLogFormatter.options ⇒ <code>Object</code>
Returns the options passed into the constructor.

**Kind**: instance property of [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)  

* * *

<a name="AbstractLogFormatter+format"></a>

### abstractLogFormatter.format(logentry) ⇒ <code>Object</code>
Called when a logentry needs to be formatted.  The underlying writer will call this for
each log message it needs to write out.

**Kind**: instance method of [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

<a name="AbstractLogWriter"></a>

## AbstractLogWriter
Constructor for a Log Writer.

It is important to note that this constructor is never called by you, but
is instead called by AwesomeLog when the `start()` command is issued.

Your class must call this as shown here:

```
class MyWriter extends AbstractLogWriter {
	 constructor(options) {
	   super(options);

	   ... your initialization code ...
	 }
}
```

Failure to not do the super constructor will result in errors.

You should put any kind of initialization of your writer in this constructor.

**Kind**: global interface  
**See**: [Log Writer](./docs/LogWriters.md) documentation for more details.  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 


* [AbstractLogWriter](#AbstractLogWriter)
    * [.options](#AbstractLogWriter+options) ⇒ <code>Object</code>
    * [.write(message, logentry)](#AbstractLogWriter+write) ⇒ <code>void</code>
    * [.flush()](#AbstractLogWriter+flush) ⇒ <code>void</code>
    * [.close()](#AbstractLogWriter+close) ⇒ <code>void</code>


* * *

<a name="AbstractLogWriter+options"></a>

### abstractLogWriter.options ⇒ <code>Object</code>
Returns the Writer option passed in.

**Kind**: instance property of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* * *

<a name="AbstractLogWriter+write"></a>

### abstractLogWriter.write(message, logentry) ⇒ <code>void</code>
Expected to be overloaded in the implementing sub-class, this is called when a log message
is to be written out by the writer. Log messages received at this point have already been
checked as to if they are an allowed level and are already formatted as per the defined
formatter.

The message parameter is the formatted message, returned from calling `format(logentry)`.

The logentry parameter is the unformated log details.

**Kind**: instance method of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

| Param | Type |
| --- | --- |
| message | <code>\*</code> | 
| logentry | <code>Object</code> | 


* * *

<a name="AbstractLogWriter+flush"></a>

### abstractLogWriter.flush() ⇒ <code>void</code>
Called to ensure that the writer has written all message out.

**Kind**: instance method of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* * *

<a name="AbstractLogWriter+close"></a>

### abstractLogWriter.close() ⇒ <code>void</code>
Called when the writer is closing and should be cleaned up. No Log messages
will be received after this call has been made.

**Kind**: instance method of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* * *

<a name="AwesomeLog"></a>

## AwesomeLog
AwesomeLog is a singleton object returned when you
`const Log = require("@awesomeeng/awesome-log")`. From it you
can initialize and start your log service and then begin writing
log messages out. Please see our
[extensive documentation](../README.md) for usage details.

**Kind**: global class  

* [AwesomeLog](#AwesomeLog)
    * [.AbstractLogWriter](#AwesomeLog+AbstractLogWriter) ⇒ [<code>Class.&lt;AbstractLogWriter&gt;</code>](#AbstractLogWriter)
    * [.AbstractLogFormatter](#AwesomeLog+AbstractLogFormatter) ⇒ [<code>Class.&lt;AbstractLogFormatter&gt;</code>](#AbstractLogFormatter)
    * [.initialized](#AwesomeLog+initialized) ⇒ <code>boolean</code>
    * [.running](#AwesomeLog+running) ⇒ <code>boolean</code>
    * [.config](#AwesomeLog+config) ⇒ <code>Object</code>
    * [.history](#AwesomeLog+history) ⇒ <code>Array</code>
    * [.historySizeLimit](#AwesomeLog+historySizeLimit) ⇒ <code>number</code>
    * [.levels](#AwesomeLog+levels) ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
    * [.levelNames](#AwesomeLog+levelNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [.defineWriter(name, filename)](#AwesomeLog+defineWriter) ⇒ <code>void</code>
    * [.defineFormatter(name, filename)](#AwesomeLog+defineFormatter) ⇒ <code>void</code>
    * [.init(config)](#AwesomeLog+init) ⇒ <code>void</code>
    * [.start()](#AwesomeLog+start) ⇒ <code>void</code>
    * [.stop()](#AwesomeLog+stop) ⇒ <code>void</code>
    * [.pause()](#AwesomeLog+pause) ⇒ <code>void</code>
    * [.resume()](#AwesomeLog+resume) ⇒ <code>void</code>
    * [.clearHistory()](#AwesomeLog+clearHistory) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.getLevel(level)](#AwesomeLog+getLevel) ⇒ [<code>LogLevel</code>](#LogLevel)
    * [.log(level, text, ...args)](#AwesomeLog+log) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.captureSubProcess(subprocess)](#AwesomeLog+captureSubProcess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.releaseSubProcess(subprocess)](#AwesomeLog+releaseSubProcess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.unrequire()](#AwesomeLog+unrequire)


* * *

<a name="AwesomeLog+AbstractLogWriter"></a>

### awesomeLog.AbstractLogWriter ⇒ [<code>Class.&lt;AbstractLogWriter&gt;</code>](#AbstractLogWriter)
Returns the AbstractLogWriter class for use in creating custom Log Writers.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+AbstractLogFormatter"></a>

### awesomeLog.AbstractLogFormatter ⇒ [<code>Class.&lt;AbstractLogFormatter&gt;</code>](#AbstractLogFormatter)
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

### awesomeLog.levels ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
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

<a name="AwesomeLog+defineWriter"></a>

### awesomeLog.defineWriter(name, filename) ⇒ <code>void</code>
Map a new Log Writer to a specific filename, for usage in configuring AwesomeLog.
The filename given must export a class that extends AbstractLogWriter.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| filename | <code>string</code> | 


* * *

<a name="AwesomeLog+defineFormatter"></a>

### awesomeLog.defineFormatter(name, filename) ⇒ <code>void</code>
Map a new Log Formatter to a specific filename, for usage in configuring AwesomeLog.
The filename given must export a class that extends AbstractLogFormatter.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| filename | <code>string</code> | 


* * *

<a name="AwesomeLog+init"></a>

### awesomeLog.init(config) ⇒ <code>void</code>
Initializes AwesomeLog for usage. This should be called very early in your application,
in the entry point if possible.

You may only initialize if AwesomeLog is not running, which is done by calling
`start()`, so do this before `start()`.

This method takes an optional configuration object. This configuration object is merged
with the default configuration to produce the overall configuration.  Below is the
default configuration values:

```
config = {
  buffering: false,
  separate: true,
  noDebugger: true,
  history: true,
  historySizeLimit: 100,
  historyFormatter: "default",
  historyFormatterOptions: {},
  levels: "access,error,warn,info,debug",
  disableLoggingNotices: false, // true if this is a child process
  loggingNoticesLevel: "info",
  fields: "timestamp,pid,system,level,text,args",
  writers: [],
  backlogSizeLimit: 1000,
  disableSubProcesses: false,
  scopeMap: null,
  scopeCatchAll: "info"
}
```

If no writers are provided, a default Console Writer is added to the configuration.

```
config.writers = [{
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

`start()` is responsible for initializing the writers.

If any backlog messages exist when `start()` is called, they will be written
via the writers after they are started.

`start()` returns a promise, which allows it to be awaited using async/await.
It is okay not to await for start to complete. AwesomeLog will still capture
any log writes in its backlog and write them when `start()` is complete.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+stop"></a>

### awesomeLog.stop() ⇒ <code>void</code>
Stops AwesomeLog running. Once stopped AwesomeLog can be reconfigured via another
`init()` call.

`stop()` returns a promise, which allows it to be awaited using async/await.
Generally it is okay to not await for `stop()` to complete.

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

### awesomeLog.getLevel(level) ⇒ [<code>LogLevel</code>](#LogLevel)
For any given level string, return the associated LogLevel object.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| [<code>LogLevel</code>](#LogLevel) | 


* * *

<a name="AwesomeLog+log"></a>

### awesomeLog.log(level, text, ...args) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Log a single messages.

`log()` is called by all other shortcut log methods.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| [<code>LogLevel</code>](#LogLevel) | 
| text | <code>string</code> | 
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

<a name="AwesomeLog+unrequire"></a>

### awesomeLog.unrequire()
Removes awesomelog global instace. used mostly in testing.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="LogLevel"></a>

## LogLevel
Class for holding LogLevel names and their associated needs.

See our [Log Levels](./docs/LogLevels.md) documentation for more detials.

**Kind**: global class  

* [LogLevel](#LogLevel)
    * [new LogLevel(name)](#new_LogLevel_new)
    * [.name](#LogLevel+name) ⇒ <code>string</code>
    * [.toJSON()](#LogLevel+toJSON) ⇒ <code>string</code>


* * *

<a name="new_LogLevel_new"></a>

### new LogLevel(name)

| Param | Type |
| --- | --- |
| name | <code>string</code> | 


* * *

<a name="LogLevel+name"></a>

### logLevel.name ⇒ <code>string</code>
Return the LogLevel name, as a string. All upper case.

**Kind**: instance property of [<code>LogLevel</code>](#LogLevel)  

* * *

<a name="LogLevel+toJSON"></a>

### logLevel.toJSON() ⇒ <code>string</code>
Returns the LogLevel object as JSON string, which is just the name.

**Kind**: instance method of [<code>LogLevel</code>](#LogLevel)  

* * *

