// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeLog = require("../../src/AwesomeLog.js");
const Log = new AwesomeLog();

Log.init();
Log.start();
Log.debug("cluster","test log from cluster 1.");
Log.debug("cluster","test log from cluster 2.");
Log.debug("cluster","test log from cluster 3.");
Log.stop();
