# AwesomeLog Release Notes

#### **Version 4.8.3**

 - Fixes a bug introduced in v4.8.0 that we tried to fix in v4.8.2 but we really, really suck.
 
#### **Version 4.8.2**

 - Fixes a bug introduced in v4.8.0 that we trid to fix in v4.8.1 but we suck.
 
#### **Version 4.8.1**

 - Fixes a bug introduced in v4.8.0 with causes not being reported when using separate threads for writing logs.
 
#### **Version 4.8.0**


 - Adds support for Error.cause when serializing and displaying Error messages.

#### **Version 4.7.0**

 - When using the JSON Formatter it is possible to pass objects in as additional arguments that cannot be turned into JSON due to Circular References or other serialization problems. We added the `allowCircularReferenceErrors` Formatter option for the JSON formatter and set it to `true` by default. This will attempt to detect when these problems occur and just remove those fields from the entry and replace it with some description of why it was removed. You can disable the behavior by setting this to `false`.

#### **Version 4.6.0**
 - Adds the **timestampFormat** configuration property for specifying the format of the timestamp on all log messages. This defaults to "epoch" which is the unix epoch in milliseconds. However, if you like you can set it to `iso8601` to get time as an iso8601 string in UTC (zulu) time such as `2023-01-26T15:46:56.109Z`.

#### **Version 4.5.0**
 - Adds the **system:<x>** field for doing system output, but allows the configuration to descend deeper into the stack trace.

#### **Version 4.4.0**
 - Fixes an error on OSX where FileWriter would not append message to a file but overwrite it each time.
 - Adds LogEntryOverride to allow for mutating a log entry from a log.xyz() call.

#### **Version 4.3.0**
 - Fixes an error that would occur if you passed a falsey value as the first argument instead of a string message.

#### **Version 4.2.4**
 - Fixes a bug in writers filtering out specific log levels. Thank you Josh Fisher!

#### **Version 4.2.3**

 - Adds simple typescript typings to make things easier for typescript users.

#### **Version 4.2.2**

 - Fixes bug in JSON Formatter alias and move options.

#### **Version 4.2.1**

 - Adds oneline, alias, and move formatter options to the JSON Formatter.  Please see the [LogFormatters Documentation](./docs/LogFormatters) for more details.

#### **Version 4.2.0**

 - Adds the ability to configure the default formatter to output an entire log entry on a single line. By default the default formatter
 will span argument output across multiple lines for easier readability. However, some cases, such as using logs in a cloud environment or
 with a log aggregator dont like this approach. This solves that by making sure one log entry === one line.

#### **Version 4.1.0**

 - adds hooks to allow developers to tap into AwesomeLog lifecycle moments and mutate things in some 
cases. See the [Hooks Documentatiuon](./docs/Hooks) for more details.

#### **Version 4.0.1**

 - Makes the default fields on production environments default to timestamp,pid,level,text,args which should speed those envionrments up by default. Environment is determined by environment variable NODE_ENV being equal to to prod or production.

#### **Version 4.0.0**

 - Makes the default fields on production environments default to timestamp,pid,level,text,args which should speed those envionrments up by default. Environment is determined by environment variable NODE_ENV being equal to to prod or production.

#### **Version 3.2.2**

 - Fixes an issue with process.mainModule being deprecated and running with Jest.

#### **Version 3.2.1**

 - Expands nodemon/forever/pm2 detection.

#### **Version 3.2.0**

 - Fixes an issue with FileWriter and creating directories in linux.
 - Fix for programs that use AwesomeLog and which are started by nodemon/forever/pm2 often dont show console output.
 - Module updates.

#### **Version 3.1.1**

 - Fixes bug with ConsoleWriter where stdout could be in a closed state, but ConsoleWriter would keep trying to write to it.

#### **Version 3.1.0**

 - Makes the global instance of AwesomeLog more stable across multiple instances of AwesomeLog being used by different modules.
 - Fixes some tests execution errors under unix and WSL.

#### **Version 3.0.3**

 - Adds the noDebugger configuration option to toggle debugger exectuion arguments getting passed to subprocess writers for AwesomeLog.  This can cause an issue when executing inside of VSCode.

#### **Version 3.0.2**

 - Updating API docs.

 - Updating dependencies.

 - Fixing broken tests.

 - Updating external dependency versions.

 - Fixes a bug where subprocess that have access to worker_threads but were not started via worker_threads would throw an exception.

#### **Version 3.0.1**

 - Fixes a bug with Error arguments not getting serialized correctly.

 - DefaultFormatter and JSObjectFormatter now output all log fields.

 - Add null formatter that just returns the raw log entry object.

 - Some more minor performance tuning.

#### **Version 3.0.0**

 - **Major performance tuning work** resulting in across the board performance gains and making AwesomeLog one of the fastest logging solutions available.

 - Adds the ability to run writers and formatters in an external process so as to not impact performance of the main javascript thread. This is enabled by default but can be disabled by setting the `separate` configuration property to `false`.

 - Adds Buffering of log entries to write on process.nextTick for further performance gains in ansycronous code. This is disabled by default, but can be enabled for better performance by setting the `buffering` configuration property to `true`.

 - Adds `fields` configuration property to adds specific data to each log entry as desired.

 - Makes the CSV Formatter write out all fields in each log entry, instead of just a handful of specific ones.

 - Removes the event emitters from AwesomeLog entirely as it may hinder performance. This can be done via a writer if needed.

 - Log.start() and Log.stop() have been changed to return a promise that will resolve when the log is fully started or fully stopped respectively.

 - Documentation updates in support of all of the above.

 - Documentation for how to run AwesomeLog in a production/high performance setup.

#### **Version 2.1.2**

 - Updated depenedency AwesomeUtils to 1.4.0

#### **Version 2.1.1**

 - Update nested usage to remove scopeCcatchAll=null option.

#### **Version 2.1.0**

 - Refactored out most of the scope stuff introduced in v2.0.0 as it introduced a major bug.

#### **Version 2.0.2**

 - Fixes version mismatch in awesome-utils

#### **Version 2.0.1**

 - Minor bug fix to how AwesomeLog returns if it has a function or not.

#### **Version 2.0.0**

 - Adds scope for handling sub-module usage better. See our [Scope](./docs/Scope.md) for more details.

 - During initialization will now display log levels in initialization log messages.

 - Removes the `initialized` event.

 - Removes the `formatter_added` event.

 - Removes the `writer_added` event.

 - Removes `system` as the first argument in log message. This is now computed dynamically.

#### **Version 1.0.0**

 - Initial release.
