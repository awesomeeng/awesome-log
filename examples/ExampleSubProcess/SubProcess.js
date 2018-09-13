// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("@awesomeeng/awesome-log");
Log.init();
Log.start();

const FREQ = 10;

let id = 0;

const next = ()=>{
	id += 1;
	let level = Log.levels[(Math.random()*Log.levels.length)|0];
	Log.log(level,null,"This is log message "+id);
	setTimeout(next,(Math.random()*FREQ)|0);
};

next();
