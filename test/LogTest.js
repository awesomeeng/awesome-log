// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

const Log = require("../src/AwesomeLog");

describe("Log",()=>{
	// beforeEach(()=>{
	// 	Log.stop();
	// 	Log.init({
	// 		writers: [{
	// 			name: "null",
	// 			type: "null"
	// 		}],
	// 		disableLoggingNotices: true,
	// 		historyFormatter: "default"
	// 	});
	// });
	//
	// afterEach(()=>{
	// 	Log.stop();
	// });

	it("initialize",()=>{
		Log.init();
		assert(Log.initialized);
	});

	// it("start",()=>{
	// 	assert(!Log.running);
	// 	Log.start();
	// 	assert(Log.running);
	// });
	//
	// it("stop",()=>{
	// 	assert(!Log.running);
	// 	Log.start();
	// 	assert(Log.running);
	// 	Log.stop();
	// 	assert(!Log.running);
	// });
	//
	// it("log",()=>{
	// 	Log.start();
	// 	Log.stop();
	// 	Log.init({
	// 		writers: [{
	// 			name: "null",
	// 			type: "null"
	// 		}],
	// 		historyFormatter: "js",
	// 		disableLoggingNotices: true,
	// 	});
	// 	Log.start();
	//
	// 	Log.log("ACCESS","Test","This is a ACCESS test.");
	// 	Log.log("ERROR","Test","This is a ERROR test.");
	// 	Log.log("WARN","Test","This is a WARN test.");
	// 	Log.log("INFO","Test","This is a INFO test.");
	// 	Log.log("DEBUG","Test","This is a DEBUG test.");
	// 	assert(Log.history.length===5);
	//
	// 	Log.log("ACCESS","Test","This is a ACCESS test.");
	// 	Log.log("ERROR","Test","This is a ERROR test.");
	// 	Log.log("WARN","Test","This is a WARN test.");
	// 	Log.log("INFO","Test","This is a INFO test.");
	// 	Log.log("DEBUG","Test","This is a DEBUG test.");
	// 	assert(Log.history.length===10);
	//
	// 	Log.stop();
	// 	Log.start();
	// 	assert(Log.history.length===0);
	// 	Log.log("access","test test test","The quick brown fox jumped over the lazy dog.");
	// 	assert.equal(Log.history.length,1);
	// 	assert(Log.history[0].pid>0);
	// 	assert(Log.history[0].timestamp>0);
	// 	assert.equal(Log.history[0].level,"ACCESS");
	// 	assert.equal(Log.history[0].system,"testtesttest");
	// 	assert.equal(Log.history[0].message,"The quick brown fox jumped over the lazy dog.");
	// 	assert(Log.history[0].args.length<1);
	//
	// 	Log.stop();
	// });
	//
	// it("pause/resume",function(){
	// 	Log.stop();
	// 	Log.init({
	// 		writers: [{
	// 			name: "null",
	// 			type: "null"
	// 		}],
	// 		disableLoggingNotices: true,
	// 	});
	// 	Log.start();
	// 	assert.equal(Log.history.length,0);
	// 	Log.info("test","Testing pause/resume 1.");
	// 	assert.equal(Log.history.length,1);
	// 	Log.info("test","Testing pause/resume 2.");
	// 	assert.equal(Log.history.length,2);
	// 	Log.pause();
	// 	assert.equal(Log.history.length,2);
	// 	Log.info("test","Testing pause/resume 3.");
	// 	assert.equal(Log.history.length,2);
	// 	Log.info("test","Testing pause/resume 4.");
	// 	assert.equal(Log.history.length,2);
	// 	Log.resume();
	// 	assert.equal(Log.history.length,4);
	// 	Log.info("test","Testing pause/resume 5.");
	// 	assert.equal(Log.history.length,5);
	// });
	//
	// it("levels",function(){
	// 	Log.stop();
	// 	Log.init({
	// 		writers: [{
	// 			name: "null",
	// 			type: "null"
	// 		}],
	// 		levels: "banana,aPPle,orangE",
	// 		historyFormatter: "js",
	// 		disableLoggingNotices: true
	// 	});
	//
	// 	assert.equal(Log.levelNames.length,3);
	// 	assert(Log.levelNames.indexOf("BANANA")>-1);
	// 	assert(Log.levelNames.indexOf("APPLE")>-1);
	// 	assert(Log.levelNames.indexOf("ORANGE")>-1);
	//
	// 	Log.start();
	//
	// 	try {
	// 		Log.access("Test","This is a ACCESS test.");
	// 		assert(false);
	// 	}
	// 	catch (ex) {
	// 		assert(true);
	// 	}
	// 	try {
	// 		Log.error("Test","This is a ERROR test.");
	// 		assert(false);
	// 	}
	// 	catch (ex) {
	// 		assert(true);
	// 	}
	// 	try {
	// 		Log.warn("Test","This is a WARN test.");
	// 		assert(false);
	// 	}
	// 	catch (ex) {
	// 		assert(true);
	// 	}
	// 	try {
	// 		Log.info("Test","This is a INFO test.");
	// 		assert(false);
	// 	}
	// 	catch (ex) {
	// 		assert(true);
	// 	}
	// 	try {
	// 		Log.debug("Test","This is a DEBUG test.");
	// 		assert(false);
	// 	}
	// 	catch (ex) {
	// 		assert(true);
	// 	}
	//
	// 	Log.banana("Test","This is a ACCESS test.");
	// 	Log.orange("Test","This is a ERROR test.");
	// 	Log.apple("Test","This is a WARN test.");
	// 	assert.equal(Log.history.length,3);
	//
	// 	Log.apple("Test","This is a INFO test.");
	// 	Log.orange("Test","This is a INFO test.");
	// 	Log.banana("Test","This is a DEBUG test.");
	//
	// 	assert(Log.history.length===6);
	//
	// 	Log.stop();
	// 	Log.init({
	// 		writers: [{
	// 			name: "null",
	// 			type: "null"
	// 		}],
	// 		levels: "banana,apple,orange,gar$bage,spa ced",
	// 		historyFormatter: "js",
	// 		disableLoggingNotices: true
	// 	});
	// 	Log.start();
	//
	// 	Log.levels.forEach((level)=>{
	// 		assert(level.name.match(/^\w+$/));
	// 	});
	//
	// 	assert(Log.history.length===0);
	// });
	//
	// it("events",function(done){
	// 	let x = 0;
	//
	// 	Log.stop();
	//
	// 	Log.once("initialized",() => x+=1);
	// 	Log.once("started",() => x+=2);
	// 	Log.once("log",() => x+=3);
	// 	Log.once("paused",() => x+=5);
	// 	Log.once("resumed",() => x+=7);
	// 	Log.once("stopped",() => {
	// 		assert.equal(x,18);
	// 		done();
	// 	});
	//
	// 	Log.init({
	// 		writers: [{
	// 			name: "null",
	// 			type: "null"
	// 		}],
	// 		disableLoggingNotices: true
	// 	});
	// 	Log.start();
	// 	Log.debug("test","testing events 1.");
	// 	Log.pause();
	// 	Log.debug("test","testing events 2.");
	// 	Log.resume();
	// 	Log.stop();
	// });
});
