// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");

describe("Hooks",()=>{
	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("beforeStart",async function(){
		let hookCalls = 0;
		const hook = () => {
			hookCalls += 1;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				beforeStart: hook 
			}
		});

		assert(Log.config.hooks.beforeStart === hook);
		assert(hookCalls === 0);

		await Log.start();
		assert(hookCalls === 1);
		
		Log.info("Hello world.");
		assert(hookCalls === 1);
		
		await Log.stop();
		assert(hookCalls === 1);
	});

	it("afterStart",async function(){
		let hookCalls = 0;
		const hook = () => {
			hookCalls += 1;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				afterStart: hook 
			}
		});

		assert(Log.config.hooks.afterStart === hook);
		assert(hookCalls === 0);

		await Log.start();
		assert(hookCalls === 1);
		
		Log.info("Hello world.");
		assert(hookCalls === 1);
		
		await Log.stop();
		assert(hookCalls === 1);
	});

	it("beforeStop",async function(){
		let hookCalls = 0;
		const hook = () => {
			hookCalls += 1;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				beforeStop: hook 
			}
		});

		assert(Log.config.hooks.beforeStop === hook);
		assert(hookCalls === 0);
		
		await Log.start();
		assert(hookCalls === 0);
		
		Log.info("Hello world.");
		assert(hookCalls === 0);
		
		await Log.stop();
		assert(hookCalls === 1);
	});

	it("afterStop",async function(){
		let hookCalls = 0;
		const hook = () => {
			hookCalls += 1;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				afterStop: hook 
			}
		});

		assert(Log.config.hooks.afterStop === hook);
		assert(hookCalls === 0);
		
		await Log.start();
		assert(hookCalls === 0);
		
		Log.info("Hello world.");
		assert(hookCalls === 0);
		
		await Log.stop();
		assert(hookCalls === 1);
	});

	it("beforeLog",async function(){
		let hookCalls = 0;
		const hook = () => {
			hookCalls += 1;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				beforeLog: hook 
			}
		});

		assert(Log.config.hooks.beforeLog === hook);
		assert(hookCalls === 0);
		
		await Log.start();
		assert(hookCalls === 0);
		
		Log.info("Hello world.");
		assert(hookCalls === 1);
		
		Log.info("Greetings.");
		assert(hookCalls === 2);
		
		Log.info("Beer!");
		assert(hookCalls === 3);
		
		await Log.stop();
		assert(hookCalls === 3);
	});

	it("afterLog",async function(){
		let hookCalls = 0;
		const hook = () => {
			hookCalls += 1;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				afterLog: hook 
			}
		});

		assert(Log.config.hooks.afterLog === hook);
		assert(hookCalls === 0);
		
		await Log.start();
		assert(hookCalls === 0);
		
		Log.info("Hello world.");
		assert(hookCalls === 1);
		
		Log.info("Greetings.");
		assert(hookCalls === 2);
		
		Log.info("Beer!");
		assert(hookCalls === 3);
		
		await Log.stop();
		assert(hookCalls === 3);
	});

	it("beforeLogEntry",async function(){
		let hookCalls = 0;
		const hook = () => {
			hookCalls += 1;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				beforeLogEntry: hook 
			}
		});

		assert(Log.config.hooks.beforeLogEntry === hook);
		assert(hookCalls === 0);
		
		await Log.start();
		assert(hookCalls === 0);
		
		Log.info("Hello world.");
		assert(hookCalls === 1);
		
		Log.info("Greetings.");
		assert(hookCalls === 2);
		
		Log.info("Beer!");
		assert(hookCalls === 3);
		
		await Log.stop();
		assert(hookCalls === 3);
	});

	it("afterLogEntry",async function(){
		let hookCalls = 0;
		const hook = () => {
			hookCalls += 1;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				afterLogEntry: hook 
			}
		});

		assert(Log.config.hooks.afterLogEntry === hook);
		assert(hookCalls === 0);
		
		await Log.start();
		assert(hookCalls === 0);
		
		Log.info("Hello world.");
		assert(hookCalls === 1);
		
		Log.info("Greetings.");
		assert(hookCalls === 2);
		
		Log.info("Beer!");
		assert(hookCalls === 3);
		
		await Log.stop();
		assert(hookCalls === 3);
	});

	it("beforeWrite",async function(){
		let hookCalls = 0;
		const hook = () => {
			hookCalls += 1;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				beforeWrite: hook 
			}
		});

		assert(Log.config.hooks.beforeWrite === hook);
		assert(hookCalls === 0);
		
		await Log.start();
		assert(hookCalls === 0);
		
		Log.info("Hello world.");
		assert(hookCalls === 1);
		
		Log.info("Greetings.");
		assert(hookCalls === 2);
		
		Log.info("Beer!");
		assert(hookCalls === 3);
		
		await Log.stop();
		assert(hookCalls === 3);
	});

	it("afterWrite",async function(){
		let hookCalls = 0;
		const hook = () => {
			hookCalls += 1;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				afterWrite: hook 
			}
		});

		assert(Log.config.hooks.afterWrite === hook);
		assert(hookCalls === 0);
		
		await Log.start();
		assert(hookCalls === 0);
		
		Log.info("Hello world.");
		assert(hookCalls === 1);
		
		Log.info("Greetings.");
		assert(hookCalls === 2);
		
		Log.info("Beer!");
		assert(hookCalls === 3);
		
		await Log.stop();
		assert(hookCalls === 3);
	});

	it("Mutate LogEntry with AfterLogEntry",async function(){
		let oneUp = 10;
		const hook = (entry) => {
			entry.beer = ++oneUp;
		};

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			fields: "level,text,beer",
			disableLoggingNotices: true,
			historyFormatter: "js",
			hooks: {
				beforeLogEntry: hook 
			}
		});

		assert(Log.config.hooks.beforeLogEntry === hook);
		
		await Log.start();
		
		Log.info("Hello world.");
		assert(Log.history.length === 1);
		assert.deepStrictEqual(Log.history[0],{
			level: "INFO",
			text: "Hello world.",
			beer: 11
		});

		Log.info("Greetings.");
		assert(Log.history.length === 2);
		assert.deepStrictEqual(Log.history[1],{
			level: "INFO",
			text: "Greetings.",
			beer: 12
		});

		Log.info("Beer!");
		assert(Log.history.length === 3);
		assert.deepStrictEqual(Log.history[2],{
			level: "INFO",
			text: "Beer!",
			beer: 13
		});

		await Log.stop();
	});
});
