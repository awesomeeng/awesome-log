// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeLog = require("../../src/AwesomeLog.js");
const Log = new AwesomeLog();

Log.init();
Log.start();
Log.debug("child","test log from child 1.");
Log.debug("child","test log from child 2.");
Log.debug("child","test log from child 3.");
Log.stop();
