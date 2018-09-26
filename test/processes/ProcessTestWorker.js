// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("../../src/AwesomeLog.js");

Log.init();
Log.start();
Log.debug("worker","test log from worker 1.");
Log.debug("worker","test log from worker 2.");
Log.debug("worker","test log from worker 3.");
Log.stop();
