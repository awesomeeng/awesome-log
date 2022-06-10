// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("AwesomeLog",()=>{
	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("log",async ()=>{
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
		assert(Log.history.length===1);
		assert(Log.history[0].level==="INFO");
		assert(Log.history[0].text==="Hello world.");

		const override = new Log.LogEntryOverride({
			beer: "All work and no beer makes homer something something.",
		});
		Log.warn("Hello world.", override);
		assert(Log.history.length===2);
		assert(Log.history[1].level==="WARN");
		assert(Log.history[1].text==="Hello world.");
		assert(Log.history[1].beer==="All work and no beer makes homer something something.");

		Log.error(override, "Hello world.");
		assert(Log.history.length===3);
		assert(Log.history[2].level==="ERROR");
		assert(Log.history[2].text==="Hello world.");
		assert(Log.history[2].beer==="All work and no beer makes homer something something.");

		await Log.stop();
	});
});
