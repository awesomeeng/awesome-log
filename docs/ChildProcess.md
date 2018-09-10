# [AwesomeLog](../README.md) > Child Processes

AwesomeLog has facilities for capturing AwesomeLog messages from child processes, clustering, and worker threads.  In doing so, AwesomeLog will grab the individual messages from the dependent processes/threads and unify them into a single log stream. This allows an AwesomeLog system to have one unified Log for multiple processes/threads.

## Setup

Using AwesomeLog across processes/threads require a couple of easy steps to setup:

First, initialize and start your log in your main application as per usual.

```
const Log = require("AwesomeLog");
Log.init();
Log.start();
```

Next, whenever you create a new process or cluster or thread, immediately after creating it call `Log.captureSubProcess(process)`. This tells AwesomeLog to watch the process for incoming log messages.

```
const CP = require("child_process");

let child = CP.fork(executable);
Log.captureSubProcess(child);
```

Finally, in each of your child processes, you need to instantiate your own AwesomeLog instance, which is fortunately super easy:

```
const Log = require("AwesomeLog");
Log.init();
Log.start();
```

Now anywhere in that child process where you use `Log`, AwesomeLog will forward the message to the parent process.

## Disabling

In some case you may want to use a separate Logging system in a Child Process. However, AwesomeLog tries to be clever whenever it sees that you are running inside a Child Process and sets itself up to use the Child Process stuff described above.  Fortunately there is a quick setting for this `disableSubProcesses` which if set to `true` will force a child process to use its own AwesomeLog instance.

## Child Processes and Log Levels

One important note to keep in mind: If you use custom log levels in your parent process, you must define and use the same custom log levels in your child process.  If the AwesomeLog parent get a log message it doesn't understand, it will generate an error.
