// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");
const CP = require("child_process");

const AwesomeUtils = require("@awesomeeng/awesome-utils");

// Setup our log
const Log = require("@awesomeeng/awesome-log");
Log.init();
Log.start();

// Create a bunch of subprocesses
const NODES = OS.cpus().length-1;
const childpath = AwesomeUtils.Module.resolve(module,"./SubProcess.js");
const children = new Array(NODES).fill(0).map(()=>{
	let child = CP.fork(childpath);
	Log.captureSubProcess(child);
	return child;
});

// stop after one 1 minute
setTimeout(async ()=>{
	children.forEach((child)=>{
		Log.releaseSubProcess(child);
		child.kill(0);
	});
	await Log.stop();
	process.exit(0);
},1000);
