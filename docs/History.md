# [AwesomeLog](../README.md) > History

AwesomeLog will keep a small number of the last N log message. This is called the history and it is available for programmatic and testing purposes.

## Configuring History

The history setting are configured as part of the `Log.init()` configuration.  You can read more about [configuration](./Configuration.md) in our detailed documentation on the subject.  Specifically the following properties apply to history:

 - **history** [boolean] - Set to false if you do not want AwesomeLog to keep a small history of log messages.  The history can be used for programatic access to the log. History is enabled by default.

 - **histroySizeLimit** [number] - The number of log entries kept in the history. 1000 by default.

 - **historyFormatter** [string] - The formatter used when writing messages to the history. `default` is used by default. It should be noted that this formatter only applies to the history, not the writers.  It is often better when working with history to set this to be `js` and just get the raw log message object back.

## Accessing the History

You access the history of AwesomeLog with the `Log.history` member.  This will return an array of the last N log messages.

You also have access to the `Log.historySizeLimit` member for getting the configured size limit.

## Performance

Turning on history slow down AwesomeLog's overall performance. If this is of concern to you, please consider turning off history.
