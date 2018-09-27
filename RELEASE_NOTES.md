# AwesomeLog Release Notes

#### **Version 1.0.0**

 - Initial release.

#### **Version 2.0.0**

 - Adds scope for handling sub-module usage better. See our [Scope](./docs/Scope.md) for more details.

 - During initialization will now display log levels in initialization log messages.

 - Removes the `initialized` event.

 - Removes the `formatter_added` event.

 - Removes the `writer_added` event.

 - Removes `system` as the first argument in log message. This is now computed dynamically.

#### **Version 2.0.1**

 - Minor bug fix to how AwesomeLog returns if it has a function or not.

#### **Version 2.0.2**

 - Fixes version mismatch in awesome-utils

#### ** Version 2.1.0**

 - Refactored out most of the scope stuff introduced in v2.0.0 as it introduced a major bug.

 
