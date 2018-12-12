// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("../../src/AwesomeLog.js");

(async ()=>{
	Log.init();
	await Log.start();
	Log.debug("worker","test log from worker 1.");
	Log.debug("worker","test log from worker 2.");
	Log.debug("worker","test log from worker 3.");
	await Log.stop();
})();
