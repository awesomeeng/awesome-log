# AwesomeLog Release Notes

#### **Version 1.0.0**

 - Initial release.

#### **Version 1.1.0**

 - Adds scope for handling sub-module usage better. See our [Scope](./docs/Scope.md) for more details.

 - During initialization will now display log levels in initialization log messages.

 - Removes the `initialized` event.

 - Removes the `formatter_added` event.

 - Removes the `writer_added` event.

 - Removes `system` as the first argument in log message. This is now computed dynamically.
