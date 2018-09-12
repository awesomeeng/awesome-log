## Classes

<dl>
<dt><a href="#AwesomeLog">AwesomeLog</a> ⇐ <code>Events</code></dt>
<dd><p>AwesomeLog is a singleton class that will always return a single AwesomeLog
instance each time it is required.</p>
</dd>
<dt><a href="#LogLevel">LogLevel</a></dt>
<dd><p>Class for holding LogLevel names and it associated needs.</p>
</dd>
<dt><a href="#ConsoleWriter">ConsoleWriter</a> ⇐ <code><a href="#AbstractLogWriter">AbstractLogWriter</a></code></dt>
<dd><p>A writer for outputing to STDOUT. This is the default writer used if
no writers are provided to <code>AwesomeLog.init()</code>.</p>
<p>Supports writing to STDOUT only.  Allows for optional ANSI color
escape sequences to be included.</p>
</dd>
<dt><a href="#FileWriter">FileWriter</a> ⇐ <code><a href="#AbstractLogWriter">AbstractLogWriter</a></code></dt>
<dd><p>A writer for outputing to a specific file or file pattern.</p>
<p>If you give a simple filename, the log will be written to that filename
indefinately, appending each time. This is fine for simple systems.</p>
<p>For more complex systems you will want to provide a filename pattern
which looks something like this <code>logs/NyLog.{YYYYMMDD}.log</code> which will change
the file written to based on the current date, in this case the Year Month Day
pattern.</p>
</dd>
<dt><a href="#NullWriter">NullWriter</a> ⇐ <code><a href="#AbstractLogWriter">AbstractLogWriter</a></code></dt>
<dd><p>A writer for outputing to /dev/null, thus outputting to nowhere.</p>
</dd>
<dt><a href="#SubProcessWriter">SubProcessWriter</a> ⇐ <code><a href="#AbstractLogWriter">AbstractLogWriter</a></code></dt>
<dd><p>A writer for usage by child process / cluster / worker threads. This is
used internally by AwesomeLog with child processes.</p>
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
     constructor(parent) {
       super(parent);

       ... your initialization code ...
     }
}
</code></pre><p>Failure to not do the super constructor will result in errors.</p>
<p>You should put any kind of initialization of your formatter in this constructor.</p>
</dd>
<dt><a href="#AbstractLogWriter">AbstractLogWriter</a></dt>
<dd><p>Constructor for a Log Writer.</p>
<p>It is important to note that this constructor is never called by you, but
is instead called by AwesomeLog when the <code>start()</code> command is issued.</p>
<p>Your class must call this as shown here:</p>
<pre><code>class MyWriter extends AbstractLogWriter {
     constructor(parent,type,name,levels,formatter,options) {
       super(parent,type,name,levels,formatter,options);

       ... your initialization code ...
     }
}
</code></pre><p>Failure to not do the super constructor will result in errors.</p>
<p>You should put any kind of initialization of your writer in this constructor.</p>
</dd>
</dl>

<a name="AbstractLogFormatter"></a>

## AbstractLogFormatter
Constructor for a Log Formatter.It is important to note that this constructor is never called by you, butis instead called by AwesomeLog when the `start()` command is issued.Your class must call this as shown here:```class MyFormatter extends AbstractLogFormatter {	 constructor(parent) {	   super(parent);	   ... your initialization code ...	 }}```Failure to not do the super constructor will result in errors.You should put any kind of initialization of your formatter in this constructor.

**Kind**: global interface  
**See**: [Log Writer](./docs/LogFormatters.md) documentation for more details.  

| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 


* [AbstractLogFormatter](#AbstractLogFormatter)
    * [.parent](#AbstractLogFormatter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.format()](#AbstractLogFormatter+format) ⇒ <code>Object</code>


* * *

<a name="AbstractLogFormatter+parent"></a>

### abstractLogFormatter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)  

* * *

<a name="AbstractLogFormatter+format"></a>

### abstractLogFormatter.format() ⇒ <code>Object</code>
Called when a logentry needs to be formatted.  The underlying writer will call this foreach log message it needs to write out.

**Kind**: instance method of [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)  

* * *

<a name="AbstractLogWriter"></a>

## AbstractLogWriter
Constructor for a Log Writer.It is important to note that this constructor is never called by you, butis instead called by AwesomeLog when the `start()` command is issued.Your class must call this as shown here:```class MyWriter extends AbstractLogWriter {	 constructor(parent,type,name,levels,formatter,options) {	   super(parent,type,name,levels,formatter,options);	   ... your initialization code ...	 }}```Failure to not do the super constructor will result in errors.You should put any kind of initialization of your writer in this constructor.

**Kind**: global interface  
**See**: [Log Writer](./docs/LogWriters.md) documentation for more details.  

| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 
| type | <code>string</code> | 
| name | <code>string</code> | 
| levels | <code>string</code> | 
| formatter | [<code>AbstractLogFormatter</code>](#AbstractLogFormatter) | 
| options | <code>Object</code> | 


* [AbstractLogWriter](#AbstractLogWriter)
    * [.parent](#AbstractLogWriter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.type](#AbstractLogWriter+type) ⇒ <code>string</code>
    * [.name](#AbstractLogWriter+name) ⇒ <code>string</code>
    * [.levels](#AbstractLogWriter+levels) ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
    * [.formatter](#AbstractLogWriter+formatter) ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [.options](#AbstractLogWriter+options) ⇒ <code>Object</code>
    * [.takesLevel(level)](#AbstractLogWriter+takesLevel) ⇒ [<code>LogLevel</code>](#LogLevel)
    * [.format(logentry)](#AbstractLogWriter+format) ⇒ <code>\*</code>
    * [.write(message, logentry)](#AbstractLogWriter+write) ⇒ <code>void</code>
    * [.flush()](#AbstractLogWriter+flush) ⇒ <code>void</code>
    * [.close()](#AbstractLogWriter+close) ⇒ <code>void</code>


* * *

<a name="AbstractLogWriter+parent"></a>

### abstractLogWriter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* * *

<a name="AbstractLogWriter+type"></a>

### abstractLogWriter.type ⇒ <code>string</code>
Returns the type name for this class.

**Kind**: instance property of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* * *

<a name="AbstractLogWriter+name"></a>

### abstractLogWriter.name ⇒ <code>string</code>
Returns the friendly name for the instance of this writer.

**Kind**: instance property of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* * *

<a name="AbstractLogWriter+levels"></a>

### abstractLogWriter.levels ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
Returns an array of LogLevel objects for the defined levels of this writer. Theseare the levels this writer is allowing through.

**Kind**: instance property of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* * *

<a name="AbstractLogWriter+formatter"></a>

### abstractLogWriter.formatter ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
Returns the formatter associated with this writer.

**Kind**: instance property of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* * *

<a name="AbstractLogWriter+options"></a>

### abstractLogWriter.options ⇒ <code>Object</code>
Returns the Writer option passed in.

**Kind**: instance property of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* * *

<a name="AbstractLogWriter+takesLevel"></a>

### abstractLogWriter.takesLevel(level) ⇒ [<code>LogLevel</code>](#LogLevel)
Returns true of this Writer is processing a given log level.

**Kind**: instance method of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| [<code>LogLevel</code>](#LogLevel) | 


* * *

<a name="AbstractLogWriter+format"></a>

### abstractLogWriter.format(logentry) ⇒ <code>\*</code>
Given some log entry object, format it as per the given formatter.

**Kind**: instance method of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

<a name="AbstractLogWriter+write"></a>

### abstractLogWriter.write(message, logentry) ⇒ <code>void</code>
Expected to be overloaded in the implementing sub-class, this is called when a log messageis to be written out by the writer. Log messages received at this point have already beenchecked as to if they are an allowed level and are already formatted as per the definedformatter.The message parameter is the formatted message, returned from calling `format(logentry)`.The logentry parameter is the unformated log details.

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
Called when the writer is closing and should be cleaned up. No Log messageswill be received after this call has been made.

**Kind**: instance method of [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* * *

<a name="AwesomeLog"></a>

## AwesomeLog ⇐ <code>Events</code>
AwesomeLog is a singleton class that will always return a single AwesomeLoginstance each time it is required.

**Kind**: global class  
**Extends**: <code>Events</code>  
**See**: [AwesomeLog README](../README.md) for usage details.  

* [AwesomeLog](#AwesomeLog) ⇐ <code>Events</code>
    * [new AwesomeLog()](#new_AwesomeLog_new)
    * [.AbstractLogWriter](#AwesomeLog+AbstractLogWriter) ⇒ [<code>Class.&lt;AbstractLogWriter&gt;</code>](#AbstractLogWriter)
    * [.AbstractLogFormatter](#AwesomeLog+AbstractLogFormatter) ⇒ [<code>Class.&lt;AbstractLogFormatter&gt;</code>](#AbstractLogFormatter)
    * [.initialized](#AwesomeLog+initialized) ⇒ <code>boolean</code>
    * [.running](#AwesomeLog+running) ⇒ <code>boolean</code>
    * [.config](#AwesomeLog+config) ⇒ <code>Object</code>
    * [.history](#AwesomeLog+history) ⇒ <code>Array</code>
    * [.historySizeLimit](#AwesomeLog+historySizeLimit) ⇒ <code>number</code>
    * [.levels](#AwesomeLog+levels) ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
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
    * [.getLevel(level)](#AwesomeLog+getLevel) ⇒ [<code>LogLevel</code>](#LogLevel)
    * [.log(level, system, message, ...args)](#AwesomeLog+log) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.captureSubProcess(subprocess)](#AwesomeLog+captureSubProcess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.releaseSubProcess(subprocess)](#AwesomeLog+releaseSubProcess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)


* * *

<a name="new_AwesomeLog_new"></a>

### new AwesomeLog()
Construct a new AwesomeLog instance. This is only ever called once per application andnever directly by the user.


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
Returns the configuration used by `init()`. This is a merge of the default configurationand the configuration passed into `init()`.

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
Returns an array of LogLevel objects for the currently configured levels. Levelsare configured via `init()`.

**Kind**: instance property of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+levelNames"></a>

### awesomeLog.levelNames ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of strings containing the level names, as taken from the LogLevelobjects. Levels are configured via `init()`.

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
| logFormatter | [<code>Class.&lt;AbstractLogFormatter&gt;</code>](#AbstractLogFormatter) | 


* * *

<a name="AwesomeLog+defineWriter"></a>

### awesomeLog.defineWriter(name, logWriter) ⇒ <code>void</code>
Map a new Log Writer to a specific name, for usage in configuring AwesomeLog.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| logWriter | [<code>Class.&lt;AbstractLogWriter&gt;</code>](#AbstractLogWriter) | 


* * *

<a name="AwesomeLog+init"></a>

### awesomeLog.init(config) ⇒ <code>void</code>
Initializes AwesomeLog for usage. This should be called very early in your application,in the entry point if possible.You may only initialize if AwesomeLog is not running, which is done by calling`start()`.This method takes an optional configuration object. This configuration object is mergedwith the default configuration to produce the overall configuration.  Below is thedefault configuration values:```config = {  history: true,  historySizeLimit: 100,  historyFormatter: "default",  levels: "access,error,warn,info,debug",  disableLoggingNotices: false, // true if this is a child process  loggingNoticesLevel: "info",  writers: [],  backlogSizeLimit: 1000,  disableSubProcesses: false}```If no writers are provided, a default Console Writer is added to the configuration.```config.writes = [{ name: "console", type:  "default", // "subprocess" if this is a child process levels: "*", formatter: default", // "subprocess" if this is a child process options: {}}];```Initialization is responsible for taking the `config.levels` parameters,transforming it into LogLevel objects, and ensuring that the log shortcutmethods are created. See also @see ./docs/LogLevels.md

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| config | <code>Object</code> \| <code>null</code> | 


* * *

<a name="AwesomeLog+start"></a>

### awesomeLog.start() ⇒ <code>void</code>
Starts AwesomeLog running and outputting log messages. This should be calledvery early in your application, in the entry point if possible.`startt()` is responsible for initializing the writers.If any backlog messages exist when `start()` is called, they will be writtenvia the writers after they are started.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+stop"></a>

### awesomeLog.stop() ⇒ <code>void</code>
Stops AwesomeLog running. Once stopped AwesomeLog can be reconfigured via another`init()` call.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

* * *

<a name="AwesomeLog+pause"></a>

### awesomeLog.pause() ⇒ <code>void</code>
Puts AwesomeLog into a paused state which prevents any log messages from beingwritten by the writers.  Log messages received while paused are stored in thebacklog and will be written when AwesomeLog is resumed.

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

### awesomeLog.log(level, system, message, ...args) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Log a single messages.`log()` is called by all other shortcut log methods.

**Kind**: instance method of [<code>AwesomeLog</code>](#AwesomeLog)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| [<code>LogLevel</code>](#LogLevel) | 
| system | <code>string</code> \| <code>null</code> | 
| message | <code>string</code> | 
| ...args | <code>\*</code> | 


* * *

<a name="AwesomeLog+captureSubProcess"></a>

### awesomeLog.captureSubProcess(subprocess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Used when you create a new child process/cluster/worker thread if you intend AwesomeLogto be used in the process/cluster/worker and want the log information consolidatedinto a single AwesomeLog stream.

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

<a name="LogLevel"></a>

## LogLevel
Class for holding LogLevel names and it associated needs.

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

<a name="ConsoleWriter"></a>

## ConsoleWriter ⇐ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
A writer for outputing to STDOUT. This is the default writer used ifno writers are provided to `AwesomeLog.init()`.Supports writing to STDOUT only.  Allows for optional ANSI colorescape sequences to be included.

**Kind**: global class  
**Extends**: [<code>AbstractLogWriter</code>](#AbstractLogWriter)  
**See**: Our [Console Writer Configuration](./docs/ConsoleWriterConfiguration.md)documentation for more details.  

* [ConsoleWriter](#ConsoleWriter) ⇐ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
    * [new ConsoleWriter(parent, name, levels, formatter, options)](#new_ConsoleWriter_new)
    * [.parent](#AbstractLogWriter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.type](#AbstractLogWriter+type) ⇒ <code>string</code>
    * [.name](#AbstractLogWriter+name) ⇒ <code>string</code>
    * [.levels](#AbstractLogWriter+levels) ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
    * [.formatter](#AbstractLogWriter+formatter) ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [.options](#AbstractLogWriter+options) ⇒ <code>Object</code>
    * [.write(message, logentry)](#ConsoleWriter+write) ⇒ <code>void</code>
    * [.flush()](#ConsoleWriter+flush) ⇒ <code>void</code>
    * [.close()](#ConsoleWriter+close) ⇒ <code>void</code>
    * [.takesLevel(level)](#AbstractLogWriter+takesLevel) ⇒ [<code>LogLevel</code>](#LogLevel)
    * [.format(logentry)](#AbstractLogWriter+format) ⇒ <code>\*</code>


* * *

<a name="new_ConsoleWriter_new"></a>

### new ConsoleWriter(parent, name, levels, formatter, options)
Creates a new Console Writer. Never called directly, but AwesomeLogwill call this when `AwesomeLog.start()` is issued.The options parameters can be used to configure this Console Writer.Here are the default configuration values:```options = {  colorize: true,  colorStyle: "level", // "line" or "level"  colors: {	   ACCESS: "green",	   ERROR: "red",	   WARN: "yellow",	   INFO: "magenta",	   DEBUG: "cyan",  }}```


| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 
| name | <code>string</code> | 
| levels | <code>string</code> | 
| formatter | [<code>AbstractLogFormatter</code>](#AbstractLogFormatter) | 
| options | <code>Object</code> | 


* * *

<a name="AbstractLogWriter+parent"></a>

### consoleWriter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>ConsoleWriter</code>](#ConsoleWriter)  

* * *

<a name="AbstractLogWriter+type"></a>

### consoleWriter.type ⇒ <code>string</code>
Returns the type name for this class.

**Kind**: instance property of [<code>ConsoleWriter</code>](#ConsoleWriter)  

* * *

<a name="AbstractLogWriter+name"></a>

### consoleWriter.name ⇒ <code>string</code>
Returns the friendly name for the instance of this writer.

**Kind**: instance property of [<code>ConsoleWriter</code>](#ConsoleWriter)  

* * *

<a name="AbstractLogWriter+levels"></a>

### consoleWriter.levels ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
Returns an array of LogLevel objects for the defined levels of this writer. Theseare the levels this writer is allowing through.

**Kind**: instance property of [<code>ConsoleWriter</code>](#ConsoleWriter)  

* * *

<a name="AbstractLogWriter+formatter"></a>

### consoleWriter.formatter ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
Returns the formatter associated with this writer.

**Kind**: instance property of [<code>ConsoleWriter</code>](#ConsoleWriter)  

* * *

<a name="AbstractLogWriter+options"></a>

### consoleWriter.options ⇒ <code>Object</code>
Returns the Writer option passed in.

**Kind**: instance property of [<code>ConsoleWriter</code>](#ConsoleWriter)  

* * *

<a name="ConsoleWriter+write"></a>

### consoleWriter.write(message, logentry) ⇒ <code>void</code>
Write a log message to STDOUT.

**Kind**: instance method of [<code>ConsoleWriter</code>](#ConsoleWriter)  
**Overrides**: [<code>write</code>](#AbstractLogWriter+write)  

| Param | Type |
| --- | --- |
| message | <code>\*</code> | 
| logentry | <code>Object</code> | 


* * *

<a name="ConsoleWriter+flush"></a>

### consoleWriter.flush() ⇒ <code>void</code>
Flush the pending writes. This has not effect in this case.

**Kind**: instance method of [<code>ConsoleWriter</code>](#ConsoleWriter)  
**Overrides**: [<code>flush</code>](#AbstractLogWriter+flush)  

* * *

<a name="ConsoleWriter+close"></a>

### consoleWriter.close() ⇒ <code>void</code>
Close the writer. This has not effect in this case.

**Kind**: instance method of [<code>ConsoleWriter</code>](#ConsoleWriter)  
**Overrides**: [<code>close</code>](#AbstractLogWriter+close)  

* * *

<a name="AbstractLogWriter+takesLevel"></a>

### consoleWriter.takesLevel(level) ⇒ [<code>LogLevel</code>](#LogLevel)
Returns true of this Writer is processing a given log level.

**Kind**: instance method of [<code>ConsoleWriter</code>](#ConsoleWriter)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| [<code>LogLevel</code>](#LogLevel) | 


* * *

<a name="AbstractLogWriter+format"></a>

### consoleWriter.format(logentry) ⇒ <code>\*</code>
Given some log entry object, format it as per the given formatter.

**Kind**: instance method of [<code>ConsoleWriter</code>](#ConsoleWriter)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

<a name="FileWriter"></a>

## FileWriter ⇐ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
A writer for outputing to a specific file or file pattern.If you give a simple filename, the log will be written to that filenameindefinately, appending each time. This is fine for simple systems.For more complex systems you will want to provide a filename patternwhich looks something like this `logs/NyLog.{YYYYMMDD}.log` which will changethe file written to based on the current date, in this case the Year Month Daypattern.

**Kind**: global class  
**Extends**: [<code>AbstractLogWriter</code>](#AbstractLogWriter)  
**See**: Our [File Writer Configuration](./docs/FileWriterConfiguration.md)documentation for more details.  

* [FileWriter](#FileWriter) ⇐ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
    * [new FileWriter(parent, name, levels, formatter, options)](#new_FileWriter_new)
    * [.parent](#AbstractLogWriter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.type](#AbstractLogWriter+type) ⇒ <code>string</code>
    * [.name](#AbstractLogWriter+name) ⇒ <code>string</code>
    * [.levels](#AbstractLogWriter+levels) ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
    * [.formatter](#AbstractLogWriter+formatter) ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [.options](#AbstractLogWriter+options) ⇒ <code>Object</code>
    * [.write(message, logentry)](#FileWriter+write) ⇒ <code>void</code>
    * [.flush()](#FileWriter+flush) ⇒ <code>void</code>
    * [.close()](#FileWriter+close) ⇒ <code>void</code>
    * [.takesLevel(level)](#AbstractLogWriter+takesLevel) ⇒ [<code>LogLevel</code>](#LogLevel)
    * [.format(logentry)](#AbstractLogWriter+format) ⇒ <code>\*</code>


* * *

<a name="new_FileWriter_new"></a>

### new FileWriter(parent, name, levels, formatter, options)
Creates a new File Writer. Never called directly, but AwesomeLogwill call this when `AwesomeLog.start()` is issued.The options parameters can be used to configure this Console Writer.Here are the default configuration values:```options = {  filename: "logs/AwesomeLog.{YYYYMMDD}.log",  housekeeping: false}```Housekeeping can be `false` or a number representing a number ofmilliseconds after which a file is considered old.  Old files aredeleted by the system.


| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 
| name | <code>string</code> | 
| levels | <code>string</code> | 
| formatter | [<code>AbstractLogFormatter</code>](#AbstractLogFormatter) | 
| options | <code>Object</code> | 


* * *

<a name="AbstractLogWriter+parent"></a>

### fileWriter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>FileWriter</code>](#FileWriter)  

* * *

<a name="AbstractLogWriter+type"></a>

### fileWriter.type ⇒ <code>string</code>
Returns the type name for this class.

**Kind**: instance property of [<code>FileWriter</code>](#FileWriter)  

* * *

<a name="AbstractLogWriter+name"></a>

### fileWriter.name ⇒ <code>string</code>
Returns the friendly name for the instance of this writer.

**Kind**: instance property of [<code>FileWriter</code>](#FileWriter)  

* * *

<a name="AbstractLogWriter+levels"></a>

### fileWriter.levels ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
Returns an array of LogLevel objects for the defined levels of this writer. Theseare the levels this writer is allowing through.

**Kind**: instance property of [<code>FileWriter</code>](#FileWriter)  

* * *

<a name="AbstractLogWriter+formatter"></a>

### fileWriter.formatter ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
Returns the formatter associated with this writer.

**Kind**: instance property of [<code>FileWriter</code>](#FileWriter)  

* * *

<a name="AbstractLogWriter+options"></a>

### fileWriter.options ⇒ <code>Object</code>
Returns the Writer option passed in.

**Kind**: instance property of [<code>FileWriter</code>](#FileWriter)  

* * *

<a name="FileWriter+write"></a>

### fileWriter.write(message, logentry) ⇒ <code>void</code>
Write a log message to the log file.

**Kind**: instance method of [<code>FileWriter</code>](#FileWriter)  
**Overrides**: [<code>write</code>](#AbstractLogWriter+write)  

| Param | Type |
| --- | --- |
| message | <code>\*</code> | 
| logentry | <code>Object</code> | 


* * *

<a name="FileWriter+flush"></a>

### fileWriter.flush() ⇒ <code>void</code>
Flush the pending writes. This has not effect in this case.

**Kind**: instance method of [<code>FileWriter</code>](#FileWriter)  
**Overrides**: [<code>flush</code>](#AbstractLogWriter+flush)  

* * *

<a name="FileWriter+close"></a>

### fileWriter.close() ⇒ <code>void</code>
Close the file.

**Kind**: instance method of [<code>FileWriter</code>](#FileWriter)  
**Overrides**: [<code>close</code>](#AbstractLogWriter+close)  

* * *

<a name="AbstractLogWriter+takesLevel"></a>

### fileWriter.takesLevel(level) ⇒ [<code>LogLevel</code>](#LogLevel)
Returns true of this Writer is processing a given log level.

**Kind**: instance method of [<code>FileWriter</code>](#FileWriter)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| [<code>LogLevel</code>](#LogLevel) | 


* * *

<a name="AbstractLogWriter+format"></a>

### fileWriter.format(logentry) ⇒ <code>\*</code>
Given some log entry object, format it as per the given formatter.

**Kind**: instance method of [<code>FileWriter</code>](#FileWriter)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

<a name="NullWriter"></a>

## NullWriter ⇐ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
A writer for outputing to /dev/null, thus outputting to nowhere.

**Kind**: global class  
**Extends**: [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* [NullWriter](#NullWriter) ⇐ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
    * [new NullWriter(parent, name, levels, formatter, options)](#new_NullWriter_new)
    * [.parent](#AbstractLogWriter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.type](#AbstractLogWriter+type) ⇒ <code>string</code>
    * [.name](#AbstractLogWriter+name) ⇒ <code>string</code>
    * [.levels](#AbstractLogWriter+levels) ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
    * [.formatter](#AbstractLogWriter+formatter) ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [.options](#AbstractLogWriter+options) ⇒ <code>Object</code>
    * [.takesLevel(level)](#AbstractLogWriter+takesLevel) ⇒ [<code>LogLevel</code>](#LogLevel)
    * [.format(logentry)](#AbstractLogWriter+format) ⇒ <code>\*</code>
    * [.write(message, logentry)](#AbstractLogWriter+write) ⇒ <code>void</code>
    * [.flush()](#AbstractLogWriter+flush) ⇒ <code>void</code>
    * [.close()](#AbstractLogWriter+close) ⇒ <code>void</code>


* * *

<a name="new_NullWriter_new"></a>

### new NullWriter(parent, name, levels, formatter, options)
Creates a new Null Writer. Never called directly, but AwesomeLogwill call this when `AwesomeLog.start()` is issued.NullWriter has no options.


| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 
| name | <code>string</code> | 
| levels | <code>string</code> | 
| formatter | [<code>AbstractLogFormatter</code>](#AbstractLogFormatter) | 
| options | <code>Object</code> | 


* * *

<a name="AbstractLogWriter+parent"></a>

### nullWriter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>NullWriter</code>](#NullWriter)  

* * *

<a name="AbstractLogWriter+type"></a>

### nullWriter.type ⇒ <code>string</code>
Returns the type name for this class.

**Kind**: instance property of [<code>NullWriter</code>](#NullWriter)  

* * *

<a name="AbstractLogWriter+name"></a>

### nullWriter.name ⇒ <code>string</code>
Returns the friendly name for the instance of this writer.

**Kind**: instance property of [<code>NullWriter</code>](#NullWriter)  

* * *

<a name="AbstractLogWriter+levels"></a>

### nullWriter.levels ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
Returns an array of LogLevel objects for the defined levels of this writer. Theseare the levels this writer is allowing through.

**Kind**: instance property of [<code>NullWriter</code>](#NullWriter)  

* * *

<a name="AbstractLogWriter+formatter"></a>

### nullWriter.formatter ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
Returns the formatter associated with this writer.

**Kind**: instance property of [<code>NullWriter</code>](#NullWriter)  

* * *

<a name="AbstractLogWriter+options"></a>

### nullWriter.options ⇒ <code>Object</code>
Returns the Writer option passed in.

**Kind**: instance property of [<code>NullWriter</code>](#NullWriter)  

* * *

<a name="AbstractLogWriter+takesLevel"></a>

### nullWriter.takesLevel(level) ⇒ [<code>LogLevel</code>](#LogLevel)
Returns true of this Writer is processing a given log level.

**Kind**: instance method of [<code>NullWriter</code>](#NullWriter)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| [<code>LogLevel</code>](#LogLevel) | 


* * *

<a name="AbstractLogWriter+format"></a>

### nullWriter.format(logentry) ⇒ <code>\*</code>
Given some log entry object, format it as per the given formatter.

**Kind**: instance method of [<code>NullWriter</code>](#NullWriter)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

<a name="AbstractLogWriter+write"></a>

### nullWriter.write(message, logentry) ⇒ <code>void</code>
Expected to be overloaded in the implementing sub-class, this is called when a log messageis to be written out by the writer. Log messages received at this point have already beenchecked as to if they are an allowed level and are already formatted as per the definedformatter.The message parameter is the formatted message, returned from calling `format(logentry)`.The logentry parameter is the unformated log details.

**Kind**: instance method of [<code>NullWriter</code>](#NullWriter)  
**Overrides**: [<code>write</code>](#AbstractLogWriter+write)  

| Param | Type |
| --- | --- |
| message | <code>\*</code> | 
| logentry | <code>Object</code> | 


* * *

<a name="AbstractLogWriter+flush"></a>

### nullWriter.flush() ⇒ <code>void</code>
Called to ensure that the writer has written all message out.

**Kind**: instance method of [<code>NullWriter</code>](#NullWriter)  
**Overrides**: [<code>flush</code>](#AbstractLogWriter+flush)  

* * *

<a name="AbstractLogWriter+close"></a>

### nullWriter.close() ⇒ <code>void</code>
Called when the writer is closing and should be cleaned up. No Log messageswill be received after this call has been made.

**Kind**: instance method of [<code>NullWriter</code>](#NullWriter)  
**Overrides**: [<code>close</code>](#AbstractLogWriter+close)  

* * *

<a name="SubProcessWriter"></a>

## SubProcessWriter ⇐ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
A writer for usage by child process / cluster / worker threads. This isused internally by AwesomeLog with child processes.

**Kind**: global class  
**Extends**: [<code>AbstractLogWriter</code>](#AbstractLogWriter)  

* [SubProcessWriter](#SubProcessWriter) ⇐ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
    * [new SubProcessWriter(parent, name, levels, formatter, options)](#new_SubProcessWriter_new)
    * [.parent](#AbstractLogWriter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.type](#AbstractLogWriter+type) ⇒ <code>string</code>
    * [.name](#AbstractLogWriter+name) ⇒ <code>string</code>
    * [.levels](#AbstractLogWriter+levels) ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
    * [.formatter](#AbstractLogWriter+formatter) ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [.options](#AbstractLogWriter+options) ⇒ <code>Object</code>
    * [.write(message, logentry)](#SubProcessWriter+write) ⇒ <code>void</code>
    * [.flush()](#SubProcessWriter+flush) ⇒ <code>void</code>
    * [.close()](#SubProcessWriter+close) ⇒ <code>void</code>
    * [.takesLevel(level)](#AbstractLogWriter+takesLevel) ⇒ [<code>LogLevel</code>](#LogLevel)
    * [.format(logentry)](#AbstractLogWriter+format) ⇒ <code>\*</code>


* * *

<a name="new_SubProcessWriter_new"></a>

### new SubProcessWriter(parent, name, levels, formatter, options)
Creates a new SubProcess Writer.SubProcessWriter takes no additional options.


| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 
| name | <code>string</code> | 
| levels | <code>string</code> | 
| formatter | [<code>AbstractLogFormatter</code>](#AbstractLogFormatter) | 
| options | <code>Object</code> | 


* * *

<a name="AbstractLogWriter+parent"></a>

### subProcessWriter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>SubProcessWriter</code>](#SubProcessWriter)  

* * *

<a name="AbstractLogWriter+type"></a>

### subProcessWriter.type ⇒ <code>string</code>
Returns the type name for this class.

**Kind**: instance property of [<code>SubProcessWriter</code>](#SubProcessWriter)  

* * *

<a name="AbstractLogWriter+name"></a>

### subProcessWriter.name ⇒ <code>string</code>
Returns the friendly name for the instance of this writer.

**Kind**: instance property of [<code>SubProcessWriter</code>](#SubProcessWriter)  

* * *

<a name="AbstractLogWriter+levels"></a>

### subProcessWriter.levels ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
Returns an array of LogLevel objects for the defined levels of this writer. Theseare the levels this writer is allowing through.

**Kind**: instance property of [<code>SubProcessWriter</code>](#SubProcessWriter)  

* * *

<a name="AbstractLogWriter+formatter"></a>

### subProcessWriter.formatter ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
Returns the formatter associated with this writer.

**Kind**: instance property of [<code>SubProcessWriter</code>](#SubProcessWriter)  

* * *

<a name="AbstractLogWriter+options"></a>

### subProcessWriter.options ⇒ <code>Object</code>
Returns the Writer option passed in.

**Kind**: instance property of [<code>SubProcessWriter</code>](#SubProcessWriter)  

* * *

<a name="SubProcessWriter+write"></a>

### subProcessWriter.write(message, logentry) ⇒ <code>void</code>
Write a log message to a parent process.

**Kind**: instance method of [<code>SubProcessWriter</code>](#SubProcessWriter)  
**Overrides**: [<code>write</code>](#AbstractLogWriter+write)  

| Param | Type |
| --- | --- |
| message | <code>\*</code> | 
| logentry | <code>Object</code> | 


* * *

<a name="SubProcessWriter+flush"></a>

### subProcessWriter.flush() ⇒ <code>void</code>
Flush the pending writes. This has not effect in this case.

**Kind**: instance method of [<code>SubProcessWriter</code>](#SubProcessWriter)  
**Overrides**: [<code>flush</code>](#AbstractLogWriter+flush)  

* * *

<a name="SubProcessWriter+close"></a>

### subProcessWriter.close() ⇒ <code>void</code>
Close the writer. This has not effect in this case.

**Kind**: instance method of [<code>SubProcessWriter</code>](#SubProcessWriter)  
**Overrides**: [<code>close</code>](#AbstractLogWriter+close)  

* * *

<a name="AbstractLogWriter+takesLevel"></a>

### subProcessWriter.takesLevel(level) ⇒ [<code>LogLevel</code>](#LogLevel)
Returns true of this Writer is processing a given log level.

**Kind**: instance method of [<code>SubProcessWriter</code>](#SubProcessWriter)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| [<code>LogLevel</code>](#LogLevel) | 


* * *

<a name="AbstractLogWriter+format"></a>

### subProcessWriter.format(logentry) ⇒ <code>\*</code>
Given some log entry object, format it as per the given formatter.

**Kind**: instance method of [<code>SubProcessWriter</code>](#SubProcessWriter)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

