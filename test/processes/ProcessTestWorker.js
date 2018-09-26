// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeLog = require("../../src/AwesomeLog.js");
const Log = new AwesomeLog();

Log.init();
Log.start();
Log.debug("worker","test log from worker 1.");
Log.debug("worker","test log from worker 2.");
Log.debug("worker","test log from worker 3.");
Log.stop();
