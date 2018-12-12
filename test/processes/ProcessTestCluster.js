// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("../../src/AwesomeLog.js");

(async ()=>{
	Log.init();
	await Log.start();
	Log.debug("cluster","test log from cluster 1.");
	Log.debug("cluster","test log from cluster 2.");
	Log.debug("cluster","test log from cluster 3.");
	await Log.stop();
})();
