## Classes

<dl>
<dt><a href="#AwesomeLog">AwesomeLog</a></dt>
<dd></dd>
<dt><a href="#CSVFormatter">CSVFormatter</a> ⇐ <code><a href="#AbstractLogFormatter">AbstractLogFormatter</a></code></dt>
<dd><p>The CSV AwesomeLog formatter. This produces the following CSV data...</p>
<pre><code>TIMESTAMP,&quot;LEVEL&quot;,PID,&quot;SYSTEM&quot;,&quot;MESSAGE&quot;,ARG0,ARG1,ARG2,ETC
</code></pre><p>Note that this does not write a CSV header line.</p>
</dd>
<dt><a href="#DefaultFormatter">DefaultFormatter</a> ⇐ <code><a href="#AbstractLogFormatter">AbstractLogFormatter</a></code></dt>
<dd><p>The default AwesomeLog formatter. This produces log message in the following form:</p>
<pre><code>ISO TIMESTAMP            : #PID   : LEVEL      : SYSTEM           : MESSAGE
</code></pre><p>For example</p>
<pre><code>2018-09-13T17:47:37.201Z : #12080 : INFO       : AwesomeLog       : AwesomeLog initialized.
2018-09-13T17:47:37.207Z : #12080 : INFO       : AwesomeLog       : AwesomeLog started.
2018-09-13T17:47:37.208Z : #12080 : INFO       : Example          : This is an example log message.
</code></pre></dd>
<dt><a href="#JSObjectFormatter">JSObjectFormatter</a> ⇐ <code><a href="#AbstractLogFormatter">AbstractLogFormatter</a></code></dt>
<dd><p>The JS Object AwesomeLog formatter. This simply forwards the log entry Object onward
for usage programatically. It does not produce a readable string.</p>
</dd>
<dt><a href="#JSONFormatter">JSONFormatter</a> ⇐ <code><a href="#AbstractLogFormatter">AbstractLogFormatter</a></code></dt>
<dd><p>The JSON AwesomeLog formatter. This produces log message in JSON form. This
will include all of the details in a log entry Object.</p>
</dd>
<dt><a href="#SubProcessFormatter">SubProcessFormatter</a> ⇐ <code><a href="#AbstractLogFormatter">AbstractLogFormatter</a></code></dt>
<dd><p>The SubProcess AwesomeLog formatter. This produces log message for usage with child
processes and is only used internall by AwesomeLog.</p>
</dd>
<dt><a href="#LogExtensions">LogExtensions</a></dt>
<dd><p>Class for handling the extensions to AwesomeLog.</p>
</dd>
<dt><a href="#LogInstance">LogInstance</a> ⇐ <code>Events</code></dt>
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
Constructor for a Log Formatter.

It is important to note that this constructor is never called by you, but
is instead called by AwesomeLog when the `start()` command is issued.

Your class must call this as shown here:

```
class MyFormatter extends AbstractLogFormatter {
	 constructor(parent) {
	   super(parent);

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
Called when a logentry needs to be formatted.  The underlying writer will call this for
each log message it needs to write out.

**Kind**: instance method of [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)  

* * *

<a name="AbstractLogWriter"></a>

## AbstractLogWriter
Constructor for a Log Writer.

It is important to note that this constructor is never called by you, but
is instead called by AwesomeLog when the `start()` command is issued.

Your class must call this as shown here:

```
class MyWriter extends AbstractLogWriter {
	 constructor(parent,type,name,levels,formatter,options) {
	   super(parent,type,name,levels,formatter,options);

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
Returns an array of LogLevel objects for the defined levels of this writer. These
are the levels this writer is allowing through.

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
**Kind**: global class  

* * *

<a name="CSVFormatter"></a>

## CSVFormatter ⇐ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
The CSV AwesomeLog formatter. This produces the following CSV data...

```
TIMESTAMP,"LEVEL",PID,"SYSTEM","MESSAGE",ARG0,ARG1,ARG2,ETC
```

Note that this does not write a CSV header line.

**Kind**: global class  
**Extends**: [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)  

* [CSVFormatter](#CSVFormatter) ⇐ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [new CSVFormatter(parent)](#new_CSVFormatter_new)
    * [.parent](#AbstractLogFormatter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.format(logentry)](#CSVFormatter+format) ⇒ <code>\*</code>


* * *

<a name="new_CSVFormatter_new"></a>

### new CSVFormatter(parent)
Constructor for this formatter. Never called directly, but called by AwesomeLog
when `Log.start()` is called.


| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 


* * *

<a name="AbstractLogFormatter+parent"></a>

### csvFormatter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>CSVFormatter</code>](#CSVFormatter)  

* * *

<a name="CSVFormatter+format"></a>

### csvFormatter.format(logentry) ⇒ <code>\*</code>
Given the log entry object, format it tou our output string.

**Kind**: instance method of [<code>CSVFormatter</code>](#CSVFormatter)  
**Overrides**: [<code>format</code>](#AbstractLogFormatter+format)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

<a name="DefaultFormatter"></a>

## DefaultFormatter ⇐ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
The default AwesomeLog formatter. This produces log message in the following form:

```
ISO TIMESTAMP            : #PID   : LEVEL      : SYSTEM           : MESSAGE
```

For example

```
2018-09-13T17:47:37.201Z : #12080 : INFO       : AwesomeLog       : AwesomeLog initialized.
2018-09-13T17:47:37.207Z : #12080 : INFO       : AwesomeLog       : AwesomeLog started.
2018-09-13T17:47:37.208Z : #12080 : INFO       : Example          : This is an example log message.
```

**Kind**: global class  
**Extends**: [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)  

* [DefaultFormatter](#DefaultFormatter) ⇐ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [new DefaultFormatter(parent)](#new_DefaultFormatter_new)
    * [.parent](#AbstractLogFormatter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.format(logentry)](#DefaultFormatter+format) ⇒ <code>\*</code>


* * *

<a name="new_DefaultFormatter_new"></a>

### new DefaultFormatter(parent)
Constructor for this formatter. Never called directly, but called by AwesomeLog
when `Log.start()` is called.


| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 


* * *

<a name="AbstractLogFormatter+parent"></a>

### defaultFormatter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>DefaultFormatter</code>](#DefaultFormatter)  

* * *

<a name="DefaultFormatter+format"></a>

### defaultFormatter.format(logentry) ⇒ <code>\*</code>
Given the log entry object, format it tou our output string.

**Kind**: instance method of [<code>DefaultFormatter</code>](#DefaultFormatter)  
**Overrides**: [<code>format</code>](#AbstractLogFormatter+format)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

<a name="JSObjectFormatter"></a>

## JSObjectFormatter ⇐ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
The JS Object AwesomeLog formatter. This simply forwards the log entry Object onward
for usage programatically. It does not produce a readable string.

**Kind**: global class  
**Extends**: [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)  

* [JSObjectFormatter](#JSObjectFormatter) ⇐ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [new JSObjectFormatter(parent)](#new_JSObjectFormatter_new)
    * [.parent](#AbstractLogFormatter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.format(logentry)](#JSObjectFormatter+format) ⇒ <code>\*</code>


* * *

<a name="new_JSObjectFormatter_new"></a>

### new JSObjectFormatter(parent)
Constructor for this formatter. Never called directly, but called by AwesomeLog
when `Log.start()` is called.


| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 


* * *

<a name="AbstractLogFormatter+parent"></a>

### jsObjectFormatter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>JSObjectFormatter</code>](#JSObjectFormatter)  

* * *

<a name="JSObjectFormatter+format"></a>

### jsObjectFormatter.format(logentry) ⇒ <code>\*</code>
Given the log entry object, format it tou our output string.

**Kind**: instance method of [<code>JSObjectFormatter</code>](#JSObjectFormatter)  
**Overrides**: [<code>format</code>](#AbstractLogFormatter+format)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

<a name="JSONFormatter"></a>

## JSONFormatter ⇐ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
The JSON AwesomeLog formatter. This produces log message in JSON form. This
will include all of the details in a log entry Object.

**Kind**: global class  
**Extends**: [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)  

* [JSONFormatter](#JSONFormatter) ⇐ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [new JSONFormatter(parent)](#new_JSONFormatter_new)
    * [.parent](#AbstractLogFormatter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.format(logentry)](#JSONFormatter+format) ⇒ <code>\*</code>


* * *

<a name="new_JSONFormatter_new"></a>

### new JSONFormatter(parent)
Constructor for this formatter. Never called directly, but called by AwesomeLog
when `Log.start()` is called.


| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 


* * *

<a name="AbstractLogFormatter+parent"></a>

### jsonFormatter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>JSONFormatter</code>](#JSONFormatter)  

* * *

<a name="JSONFormatter+format"></a>

### jsonFormatter.format(logentry) ⇒ <code>\*</code>
Given the log entry object, format it tou our output string.

**Kind**: instance method of [<code>JSONFormatter</code>](#JSONFormatter)  
**Overrides**: [<code>format</code>](#AbstractLogFormatter+format)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

<a name="SubProcessFormatter"></a>

## SubProcessFormatter ⇐ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
The SubProcess AwesomeLog formatter. This produces log message for usage with child
processes and is only used internall by AwesomeLog.

**Kind**: global class  
**Extends**: [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)  

* [SubProcessFormatter](#SubProcessFormatter) ⇐ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [new SubProcessFormatter(parent)](#new_SubProcessFormatter_new)
    * [.parent](#AbstractLogFormatter+parent) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.format(logentry)](#SubProcessFormatter+format) ⇒ <code>\*</code>


* * *

<a name="new_SubProcessFormatter_new"></a>

### new SubProcessFormatter(parent)
Constructor for this formatter. Never called directly, but called by AwesomeLog
when `Log.start()` is called.


| Param | Type |
| --- | --- |
| parent | [<code>AwesomeLog</code>](#AwesomeLog) | 


* * *

<a name="AbstractLogFormatter+parent"></a>

### subProcessFormatter.parent ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Returns the parent AwesomeLog instance.

**Kind**: instance property of [<code>SubProcessFormatter</code>](#SubProcessFormatter)  

* * *

<a name="SubProcessFormatter+format"></a>

### subProcessFormatter.format(logentry) ⇒ <code>\*</code>
Given the log entry object, format it tou our output string.

**Kind**: instance method of [<code>SubProcessFormatter</code>](#SubProcessFormatter)  
**Overrides**: [<code>format</code>](#AbstractLogFormatter+format)  

| Param | Type |
| --- | --- |
| logentry | <code>Object</code> | 


* * *

<a name="LogExtensions"></a>

## LogExtensions
Class for handling the extensions to AwesomeLog.

**Kind**: global class  

* [LogExtensions](#LogExtensions)
    * [.writers](#LogExtensions+writers) ⇒ <code>Array.&lt;string&gt;</code>
    * [.formatters](#LogExtensions+formatters) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getWriter(name)](#LogExtensions+getWriter) ⇒ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
    * [.getFormatter(name)](#LogExtensions+getFormatter) ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
    * [.defineWriter(name, logWriter)](#LogExtensions+defineWriter) ⇒ <code>void</code>
    * [.defineFormatter(name, logFormatter)](#LogExtensions+defineFormatter) ⇒ <code>void</code>


* * *

<a name="LogExtensions+writers"></a>

### logExtensions.writers ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of strings containing the defined Log Writer names that can be used.

**Kind**: instance property of [<code>LogExtensions</code>](#LogExtensions)  

* * *

<a name="LogExtensions+formatters"></a>

### logExtensions.formatters ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of strings containing the defined Log Formatter names that can be used.

**Kind**: instance property of [<code>LogExtensions</code>](#LogExtensions)  

* * *

<a name="LogExtensions+getWriter"></a>

### logExtensions.getWriter(name) ⇒ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
Returns an AbstractLogWriter implementation for the given name, or undefined.

**Kind**: instance method of [<code>LogExtensions</code>](#LogExtensions)  
**Returns**: [<code>AbstractLogWriter</code>](#AbstractLogWriter) - [description]  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | [description] |


* * *

<a name="LogExtensions+getFormatter"></a>

### logExtensions.getFormatter(name) ⇒ [<code>AbstractLogFormatter</code>](#AbstractLogFormatter)
Returns an AbstractLogFormatter implementation for the given name, or undefined.

**Kind**: instance method of [<code>LogExtensions</code>](#LogExtensions)  
**Returns**: [<code>AbstractLogFormatter</code>](#AbstractLogFormatter) - [description]  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | [description] |


* * *

<a name="LogExtensions+defineWriter"></a>

### logExtensions.defineWriter(name, logWriter) ⇒ <code>void</code>
Map a new Log Writer to a specific name, for usage in configuring AwesomeLog.

**Kind**: instance method of [<code>LogExtensions</code>](#LogExtensions)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| logWriter | [<code>Class.&lt;AbstractLogWriter&gt;</code>](#AbstractLogWriter) | 


* * *

<a name="LogExtensions+defineFormatter"></a>

### logExtensions.defineFormatter(name, logFormatter) ⇒ <code>void</code>
Map a new Log Formatter to a specific name, for usage in configuring AwesomeLog.

**Kind**: instance method of [<code>LogExtensions</code>](#LogExtensions)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| logFormatter | [<code>Class.&lt;AbstractLogFormatter&gt;</code>](#AbstractLogFormatter) | 


* * *

<a name="LogInstance"></a>

## LogInstance ⇐ <code>Events</code>
AwesomeLog is a singleton class that will always return a single AwesomeLog
instance each time it is required.

**Kind**: global class  
**Extends**: <code>Events</code>  
**See**: [AwesomeLog README](../README.md) for usage details.  

* [LogInstance](#LogInstance) ⇐ <code>Events</code>
    * [new LogInstance()](#new_LogInstance_new)
    * [.AbstractLogWriter](#LogInstance+AbstractLogWriter) ⇒ [<code>Class.&lt;AbstractLogWriter&gt;</code>](#AbstractLogWriter)
    * [.AbstractLogFormatter](#LogInstance+AbstractLogFormatter) ⇒ [<code>Class.&lt;AbstractLogFormatter&gt;</code>](#AbstractLogFormatter)
    * [.id](#LogInstance+id) ⇒ <code>string</code>
    * [.initialized](#LogInstance+initialized) ⇒ <code>boolean</code>
    * [.running](#LogInstance+running) ⇒ <code>boolean</code>
    * [.config](#LogInstance+config) ⇒ <code>Object</code>
    * [.history](#LogInstance+history) ⇒ <code>Array</code>
    * [.historySizeLimit](#LogInstance+historySizeLimit) ⇒ <code>number</code>
    * [.levels](#LogInstance+levels) ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
    * [.levelNames](#LogInstance+levelNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [.init(config)](#LogInstance+init) ⇒ <code>void</code>
    * [.start()](#LogInstance+start) ⇒ <code>void</code>
    * [.stop()](#LogInstance+stop) ⇒ <code>void</code>
    * [.pause()](#LogInstance+pause) ⇒ <code>void</code>
    * [.resume()](#LogInstance+resume) ⇒ <code>void</code>
    * [.clearHistory()](#LogInstance+clearHistory) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.getLevel(level)](#LogInstance+getLevel) ⇒ [<code>LogLevel</code>](#LogLevel)
    * [.log(level, system, message, ...args)](#LogInstance+log) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.captureSubProcess(subprocess)](#LogInstance+captureSubProcess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
    * [.releaseSubProcess(subprocess)](#LogInstance+releaseSubProcess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)


* * *

<a name="new_LogInstance_new"></a>

### new LogInstance()
Construct a new AwesomeLog instance. This is only ever called once per application and
never directly by the user.


* * *

<a name="LogInstance+AbstractLogWriter"></a>

### logInstance.AbstractLogWriter ⇒ [<code>Class.&lt;AbstractLogWriter&gt;</code>](#AbstractLogWriter)
Returns the AbstractLogWriter class for use in creating custom Log Writers.

**Kind**: instance property of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+AbstractLogFormatter"></a>

### logInstance.AbstractLogFormatter ⇒ [<code>Class.&lt;AbstractLogFormatter&gt;</code>](#AbstractLogFormatter)
Returns the AbstractLogFormatter class for use in creating custom Log Formatters.

**Kind**: instance property of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+id"></a>

### logInstance.id ⇒ <code>string</code>
Returns the AwesomeLogId.

**Kind**: instance property of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+initialized"></a>

### logInstance.initialized ⇒ <code>boolean</code>
Returns true if `Log.init()` has been called.

**Kind**: instance property of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+running"></a>

### logInstance.running ⇒ <code>boolean</code>
Returns true if `Log.start()` has been called.

**Kind**: instance property of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+config"></a>

### logInstance.config ⇒ <code>Object</code>
Returns the configuration used by `init()`. This is a merge of the default configuration
and the configuration passed into `init()`.

**Kind**: instance property of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+history"></a>

### logInstance.history ⇒ <code>Array</code>
Returns an array of the last N (defined by `historySizeLimit`) log messages.

**Kind**: instance property of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+historySizeLimit"></a>

### logInstance.historySizeLimit ⇒ <code>number</code>
Returns the maximum number of `history` entries. This is set via `init()`.

**Kind**: instance property of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+levels"></a>

### logInstance.levels ⇒ [<code>Array.&lt;LogLevel&gt;</code>](#LogLevel)
Returns an array of LogLevel objects for the currently configured levels. Levels
are configured via `init()`.

**Kind**: instance property of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+levelNames"></a>

### logInstance.levelNames ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of strings containing the level names, as taken from the LogLevel
objects. Levels are configured via `init()`.

**Kind**: instance property of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+init"></a>

### logInstance.init(config) ⇒ <code>void</code>
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
  disableSubProcesses: false,
  scopeMap: null,
  scopeCatchAll: "info"
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

**Kind**: instance method of [<code>LogInstance</code>](#LogInstance)  

| Param | Type |
| --- | --- |
| config | <code>Object</code> \| <code>null</code> | 


* * *

<a name="LogInstance+start"></a>

### logInstance.start() ⇒ <code>void</code>
Starts AwesomeLog running and outputting log messages. This should be called
very early in your application, in the entry point if possible.

`startt()` is responsible for initializing the writers.

If any backlog messages exist when `start()` is called, they will be written
via the writers after they are started.

**Kind**: instance method of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+stop"></a>

### logInstance.stop() ⇒ <code>void</code>
Stops AwesomeLog running. Once stopped AwesomeLog can be reconfigured via another
`init()` call.

**Kind**: instance method of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+pause"></a>

### logInstance.pause() ⇒ <code>void</code>
Puts AwesomeLog into a paused state which prevents any log messages from being
written by the writers.  Log messages received while paused are stored in the
backlog and will be written when AwesomeLog is resumed.

**Kind**: instance method of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+resume"></a>

### logInstance.resume() ⇒ <code>void</code>
Exits the paused state and writes out any backlog messages.

**Kind**: instance method of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+clearHistory"></a>

### logInstance.clearHistory() ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Clears the stored `history` contents.

**Kind**: instance method of [<code>LogInstance</code>](#LogInstance)  

* * *

<a name="LogInstance+getLevel"></a>

### logInstance.getLevel(level) ⇒ [<code>LogLevel</code>](#LogLevel)
For any given level string, return the associated LogLevel object.

**Kind**: instance method of [<code>LogInstance</code>](#LogInstance)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| [<code>LogLevel</code>](#LogLevel) | 


* * *

<a name="LogInstance+log"></a>

### logInstance.log(level, system, message, ...args) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Log a single messages.

`log()` is called by all other shortcut log methods.

**Kind**: instance method of [<code>LogInstance</code>](#LogInstance)  

| Param | Type |
| --- | --- |
| level | <code>string</code> \| [<code>LogLevel</code>](#LogLevel) | 
| system | <code>string</code> \| <code>null</code> | 
| message | <code>string</code> | 
| ...args | <code>\*</code> | 


* * *

<a name="LogInstance+captureSubProcess"></a>

### logInstance.captureSubProcess(subprocess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Used when you create a new child process/cluster/worker thread if you intend AwesomeLog
to be used in the process/cluster/worker and want the log information consolidated
into a single AwesomeLog stream.

**Kind**: instance method of [<code>LogInstance</code>](#LogInstance)  
**See**: ./docs/ChildProcess.md  

| Param | Type |
| --- | --- |
| subprocess | <code>ChildProcess.ChildProcess</code> \| <code>Cluster.Worker</code> \| <code>WorkerThread.Worker</code> | 


* * *

<a name="LogInstance+releaseSubProcess"></a>

### logInstance.releaseSubProcess(subprocess) ⇒ [<code>AwesomeLog</code>](#AwesomeLog)
Stops capturing a process/cluster/worker log messages.

**Kind**: instance method of [<code>LogInstance</code>](#LogInstance)  
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
A writer for outputing to STDOUT. This is the default writer used if
no writers are provided to `AwesomeLog.init()`.

Supports writing to STDOUT only.  Allows for optional ANSI color
escape sequences to be included.

**Kind**: global class  
**Extends**: [<code>AbstractLogWriter</code>](#AbstractLogWriter)  
**See**: Our [Console Writer Configuration](./docs/ConsoleWriterConfiguration.md)
documentation for more details.  

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
Creates a new Console Writer. Never called directly, but AwesomeLog
will call this when `AwesomeLog.start()` is issued.

The options parameters can be used to configure this Console Writer.
Here are the default configuration values:

```
options = {
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
```


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
Returns an array of LogLevel objects for the defined levels of this writer. These
are the levels this writer is allowing through.

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
A writer for outputing to a specific file or file pattern.

If you give a simple filename, the log will be written to that filename
indefinately, appending each time. This is fine for simple systems.

For more complex systems you will want to provide a filename pattern
which looks something like this `logs/NyLog.{YYYYMMDD}.log` which will change
the file written to based on the current date, in this case the Year Month Day
pattern.

**Kind**: global class  
**Extends**: [<code>AbstractLogWriter</code>](#AbstractLogWriter)  
**See**: Our [File Writer Configuration](./docs/FileWriterConfiguration.md)
documentation for more details.  

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
Creates a new File Writer. Never called directly, but AwesomeLog
will call this when `AwesomeLog.start()` is issued.

The options parameters can be used to configure this Console Writer.
Here are the default configuration values:

```
options = {
  filename: "logs/AwesomeLog.{YYYYMMDD}.log",
  housekeeping: false
}
```

Housekeeping can be `false` or a number representing a number of
milliseconds after which a file is considered old.  Old files are
deleted by the system.


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
Returns an array of LogLevel objects for the defined levels of this writer. These
are the levels this writer is allowing through.

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
Creates a new Null Writer. Never called directly, but AwesomeLog
will call this when `AwesomeLog.start()` is issued.

NullWriter has no options.


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
Returns an array of LogLevel objects for the defined levels of this writer. These
are the levels this writer is allowing through.

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
Expected to be overloaded in the implementing sub-class, this is called when a log message
is to be written out by the writer. Log messages received at this point have already been
checked as to if they are an allowed level and are already formatted as per the defined
formatter.

The message parameter is the formatted message, returned from calling `format(logentry)`.

The logentry parameter is the unformated log details.

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
Called when the writer is closing and should be cleaned up. No Log messages
will be received after this call has been made.

**Kind**: instance method of [<code>NullWriter</code>](#NullWriter)  
**Overrides**: [<code>close</code>](#AbstractLogWriter+close)  

* * *

<a name="SubProcessWriter"></a>

## SubProcessWriter ⇐ [<code>AbstractLogWriter</code>](#AbstractLogWriter)
A writer for usage by child process / cluster / worker threads. This is
used internally by AwesomeLog with child processes.

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
Creates a new SubProcess Writer.

SubProcessWriter takes no additional options.


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
Returns an array of LogLevel objects for the defined levels of this writer. These
are the levels this writer is allowing through.

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

