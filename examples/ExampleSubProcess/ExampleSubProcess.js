// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");
const CP = require("child_process");

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const Log = require("@awesomeeng/awesome-log");
Log.init();
Log.start();

const NODES = OS.cpus().length-1;
const childpath = AwesomeUtils.Module.resolve(module,"./SubProcess.js");

new Array(NODES).fill(0).forEach(()=>{
	let child = CP.fork(childpath);
	Log.captureSubProcess(child);
});
