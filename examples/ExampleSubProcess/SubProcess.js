// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");
Log.init();
Log.start();

const FREQ = 10;

let id = 0;

const next = ()=>{
	id += 1;
	let level = Log.levels[(Math.random()*Log.levels.length)|0];
	Log.log(level,"ChildProcess","This is log message "+id);
	setTimeout(next,(Math.random()*FREQ)|0);
};

next();
