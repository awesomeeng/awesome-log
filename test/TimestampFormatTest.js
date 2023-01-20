// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("Timestamp Format",()=>{
	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("undefined format",async ()=>{
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js"
		});

		await Log.start();
		Log.info("Hello world.");
		assert.strictEqual(Log.history.length,1);
		assert.strictEqual(typeof(Log.history[0].timestamp),"number");
		await Log.stop();
	});

	it("epoch format",async ()=>{
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js",
			timestampFormat: "epoch"
		});

		await Log.start();
		Log.info("Hello world.");
		assert.strictEqual(Log.history.length,1);
		assert.strictEqual(typeof(Log.history[0].timestamp),"number");
		await Log.stop();
	});

	it("iso8601 format",async ()=>{
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js",
			timestampFormat: "iso8601"
		});

		await Log.start();
		Log.info("Hello world.");
		assert.strictEqual(Log.history.length,1);
		assert.strictEqual(typeof(Log.history[0].timestamp),"string");
		await Log.stop();
	});

	it("unknown format",async ()=>{
		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "js",
			timestampFormat: "beer"
		});

		await Log.start();
		Log.info("Hello world.");
		assert.strictEqual(Log.history.length,1);
		assert.strictEqual(typeof(Log.history[0].timestamp),"number");
		await Log.stop();
	});
});
