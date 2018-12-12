// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("../../src/AwesomeLog.js");

(async ()=>{
	Log.init();
	await Log.start();
	Log.debug("child","test log from child 1.");
	Log.debug("child","test log from child 2.");
	Log.debug("child","test log from child 3.");
	await Log.stop();
})();
