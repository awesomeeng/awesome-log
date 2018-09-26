// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("../../src/AwesomeLog.js");

Log.init({
	levels: "happy,sad"
});
Log.start();

Log.happy("Module 2 is Happy.");
Log.sad("Module 2 is Sad.");

require("./Module3");

Log.stop();
