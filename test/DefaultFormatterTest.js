// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

const AwesomeUtils = require("@awesomeeng/awesome-utils");

describe("AbstractLogFormatter",()=>{
	beforeEach(()=>{
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
	});

	afterEach(()=>{
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));
	});

	it("default formatter",function(){
		const Log = require("../src/AwesomeLog");
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
		const Log = require("../src/AwesomeLog");
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
});
