// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

const AwesomeLog = require("../src/AwesomeLog");
const Log = new AwesomeLog();

describe("AbstractLogFormatter",()=>{
	it("default formatter",function(){
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
		});
		Log.start();

		Log.info("Testing formatting...");
		assert(Log.history[0].match(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ\s:\s#\d{1,5}\s+:\sINFO\s+:\s[\w\d.-_]+\s+:\sTesting\sformatting\.\.\./));

		Log.stop();
	});

	it("default formatter arguments",function(){
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
		});
		Log.start();

		Log.info("Testing argument formatting...",null);
		assert(Log.history[0].endsWith("| null"));
		Log.clearHistory();

		Log.info("Testing argument formatting...",true);
		assert(Log.history[0].endsWith("| true"));
		Log.clearHistory();

		Log.info("Testing argument formatting...",false);
		assert(Log.history[0].endsWith("| false"));
		Log.clearHistory();

		Log.info("Testing argument formatting...",123);
		assert(Log.history[0].endsWith("| 123"));
		Log.clearHistory();

		Log.info("Testing argument formatting...","abc");
		assert(Log.history[0].endsWith("| abc"));
		Log.clearHistory();

		Log.info("Testing argument formatting...",[1,"2","three"]);
		Log.clearHistory();

		Log.info("Testing argument formatting...",{one:1,two:"2",three:"three"});
		Log.clearHistory();

		Log.info("Testing argument formatting...",new Error("test error."));
		Log.clearHistory();

		Log.stop();
	});

	it("js formatter",function(){
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js"
		});
		Log.start();

		Log.info("Testing formatting...");
		assert(Log.history[0]);
		assert(Log.history[0].timestamp);
		assert(Log.history[0].pid);
		assert.equal(Log.history[0].level,"INFO");
		assert(Log.history[0].system);
		assert.equal(Log.history[0].message,"Testing formatting...");
		assert.deepStrictEqual(Log.history[0].args,[]);

		Log.stop();
	});

	it("json formatter",function(){
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "json"
		});
		Log.start();

		Log.info("Testing formatting...");
		assert(Log.history[0]);

		let entry = JSON.parse(Log.history[0]);
		assert(entry);
		assert(entry.timestamp);
		assert(entry.pid);
		assert.equal(entry.level,"INFO");
		assert(entry.system);
		assert.equal(entry.message,"Testing formatting...");
		assert.deepStrictEqual(entry.args,[]);

		Log.stop();
	});

	it("csv formatter",function(){
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "csv"
		});
		Log.start();

		Log.info("Testing formatting...");
		Log.info("Testing formatting...",123);
		Log.info("Testing formatting...",123,"abc");
		Log.info("Testing formatting...",123,"abc",[456,"def"]);
		assert(Log.history[0].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting..."$/));
		assert(Log.history[1].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting...",123$/));
		assert(Log.history[2].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting...",123,"abc"$/));
		assert(Log.history[3].match(/^\d+,"INFO",\d+,"[\w\d.-_]+","Testing formatting...",123,"abc","\[456,\\"def\\"\]"$/));

		Log.stop();
	});
});
