// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

const Log = require("../src/Log");

describe("LogFormatter",()=>{
	beforeEach(()=>{
		Log.stop();
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "default"
		});
	});

	afterEach(()=>{
		Log.stop();
	});

	it("default formatter",function(){
		Log.start();
		Log.stop();
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
		});
		Log.start();

		Log.info("Test","Testing formatting...");
		assert(Log.history[0].match(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ\s:\s#\d{1,5}\s+:\sINFO\s+:\sTest\s+:\sTesting\sformatting\.\.\./));
	});

	it("default formatter arguments",function(){
		Log.start();
		Log.stop();
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
		});
		Log.start();

		Log.info("Test","Testing argument formatting...",null);
		assert(Log.history[0].endsWith("| null"));
		Log.clearHistory();

		Log.info("Test","Testing argument formatting...",true);
		assert(Log.history[0].endsWith("| true"));
		Log.clearHistory();

		Log.info("Test","Testing argument formatting...",false);
		assert(Log.history[0].endsWith("| false"));
		Log.clearHistory();

		Log.info("Test","Testing argument formatting...",123);
		assert(Log.history[0].endsWith("| 123"));
		Log.clearHistory();

		Log.info("Test","Testing argument formatting...","abc");
		assert(Log.history[0].endsWith("| abc"));
		Log.clearHistory();

		Log.info("Test","Testing argument formatting...",[1,"2","three"]);
		Log.clearHistory();

		Log.info("Test","Testing argument formatting...",{one:1,two:"2",three:"three"});
		Log.clearHistory();

		Log.info("Test","Testing argument formatting...",new Error("test error."));
		Log.clearHistory();
	});

	it("js formatter",function(){
		Log.start();
		Log.stop();
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js"
		});
		Log.start();

		Log.info("Test","Testing formatting...");
		assert(Log.history[0]);
		assert(Log.history[0].timestamp);
		assert(Log.history[0].pid);
		assert.equal(Log.history[0].level,"INFO");
		assert.equal(Log.history[0].system,"Test");
		assert.equal(Log.history[0].message,"Testing formatting...");
		assert.deepStrictEqual(Log.history[0].args,[]);
	});

	it("json formatter",function(){
		Log.start();
		Log.stop();
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "json"
		});
		Log.start();

		Log.info("Test","Testing formatting...");
		assert(Log.history[0]);

		let entry = JSON.parse(Log.history[0]);
		assert(entry);
		assert(entry.timestamp);
		assert(entry.pid);
		assert.equal(entry.level,"INFO");
		assert.equal(entry.system,"Test");
		assert.equal(entry.message,"Testing formatting...");
		assert.deepStrictEqual(entry.args,[]);
	});

	it("csv formatter",function(){
		Log.start();
		Log.stop();
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "csv"
		});
		Log.start();

		Log.info("Test","Testing formatting...");
		Log.info("Test","Testing formatting...",123);
		Log.info("Test","Testing formatting...",123,"abc");
		Log.info("Test","Testing formatting...",123,"abc",[456,"def"]);
		assert(Log.history[0].match(/^\d+,"INFO",\d+,"\w+",".*"$/));
		assert(Log.history[1].match(/^\d+,"INFO",\d+,"\w+",".*",123$/));
		assert(Log.history[2].match(/^\d+,"INFO",\d+,"\w+",".*",123,"abc"$/));
		assert(Log.history[3].match(/^\d+,"INFO",\d+,"\w+",".*",123,"abc","\[456,\\"def\\"\]"$/));
	});
});
