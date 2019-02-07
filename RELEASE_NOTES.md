# AwesomeLog Release Notes

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
