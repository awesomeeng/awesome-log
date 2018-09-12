## Classes

<dl>
<dt><a href="#AwesomeLog">AwesomeLog</a> ⇐ <code>Events</code></dt>
<dd><p>AwesomeLog class: An instance of this class is returned when you <code>require(&quot;AwesomeLog&quot;)</code>.</p>
<p>To use AwesomeLog requires you to first initialize and start AwesomeLog,
preferably as early in your application as possible.</p>
<pre><code>const Log = require(&quot;AwesomeLog&quot;);
Log.init();
Log.start();
</code></pre><p>You may pass an overall optional configuration to the <code>init()</code> method, as needed.</p>
<p>Every time your <code>require(&quot;AwesomeLog&quot;) you get the same instance. Prior to starting
AwesomeLog via</code>Log.start()`, any log message you send are held in the backlog until
AwesomeLog is started. Once started the backlog is written and any future log message
will be written.</p>
</dd>
<dt><a href="#ConsoleWriter">ConsoleWriter</a> ⇐ <code>LogWriter</code></dt>
<dd><p>LogWriter to /dev/null</p>
</dd>
</dl>

<a name="AwesomeLog"></a>

## AwesomeLog ⇐ <code>Events</code>
AwesomeLog class: An instance of this class is returned when you `require("AwesomeLog")`.

To use AwesomeLog requires you to first initialize and start AwesomeLog,
preferably as early in your application as possible.

```
const Log = require("AwesomeLog");
Log.init();
Log.start();
```

You may pass an overall optional configuration to the `init()` method, as needed.

Every time your `require("AwesomeLog") you get the same instance. Prior to starting
AwesomeLog via `Log.start()`, any log message you send are held in the backlog until
AwesomeLog is started. Once started the backlog is written and any future log message
will be written.

**Kind**: global class  
**Extends**: <code>Events</code>  

* * *

<a name="ConsoleWriter"></a>

## ConsoleWriter ⇐ <code>LogWriter</code>
LogWriter to /dev/null

**Kind**: global class  
**Extends**: <code>LogWriter</code>  

* * *

