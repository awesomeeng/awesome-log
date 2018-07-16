// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("../../src/Log.js");
Log.init();
Log.start();
Log.debug("child","test log from child 1.");
Log.debug("child","test log from child 2.");
Log.debug("child","test log from child 3.");
Log.stop();
