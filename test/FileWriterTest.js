// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");
const FS = require("fs");
const Path = require("path");

const AwesomeUtils = require("@awesomeeng/awesome-utils");

describe("FileWriterTest",()=>{
	let id,dir,testfile;

	beforeEach(()=>{
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));

		id = AwesomeUtils.Random.string(16);
		testfile = Path.resolve(process.cwd(),"./temp."+id+".tmp");
		dir = Path.resolve(process.cwd(),"./temp."+AwesomeUtils.Random.string(16));
	});

	afterEach(async ()=>{
		AwesomeUtils.Module.unrequire(AwesomeUtils.Module.resolve(module,"../src/AwesomeLog"));

		await AwesomeUtils.Promise.sleep(100);

		if (AwesomeUtils.FS.existsSync(testfile)) FS.unlinkSync(testfile);
		if (AwesomeUtils.FS.existsSync(dir)) AwesomeUtils.FS.recursiveRmdirSync(dir);
	});

	it("create",async function(){
		this.slow(500);

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "file-writer-test",
				type: "file",
				options: {
					housekeeping: "2 hours",
					filename: testfile
				}
			}],
			separate: false,
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "default",
			historySizeLimit: 200,
		});
		await Log.start();

		Log.info("Testing file creation...");

		await Log.stop();

		assert(AwesomeUtils.FS.existsSync(testfile));
	});

	it("write",async function(){
		this.slow(500);

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "file-writer-test",
				type: "file",
				options: {
					housekeeping: "2 hours",
					filename: testfile
				}
			}],
			separate: false,
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "default",
			historySizeLimit: 200,
		});
		await Log.start();

		new Array(99).fill(0).forEach((x,i)=>{
			Log.info("Testing file writer "+i+"...");
		});

		let historical = Log.history.join("\n")+"\n";

		await Log.stop();

		let content = FS.readFileSync(testfile);

		assert.deepStrictEqual(content.toString("utf-8"),historical);
	});

	it("rotate",async function(){
		this.slow(3000);
		this.timeout(4000);

		let id = AwesomeUtils.Random.string(16);

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "file-writer-test",
				type: "file",
				options: {
					housekeeping: 10,
					filename: Path.resolve(dir,"./temp."+id+".{x}.tmp")
				}
			}],
			separate: false,
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "default",
			historySizeLimit: 200,
		});
		await Log.start();

		Log.info("Testing formatting 1...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Testing formatting 2...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Testing formatting 3...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Testing formatting 4...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Testing formatting 5...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Testing formatting 6...");
		await AwesomeUtils.Promise.sleep(30);

		await Log.stop();

		await AwesomeUtils.Promise.sleep(1000);

		let files = FS.readdirSync(dir);
		let found = files.some((file)=>{
			return file.startsWith("temp."+id+".") && file.endsWith(".tmp");
		});

		assert(!found);
	});

	it("rotate multi",async function(){
		this.slow(3000);
		this.timeout(4000);

		const Log = require("../src/AwesomeLog");
		Log.init({
			writers: [{
				name: "file-writer-test",
				type: "file",
				options: {
					housekeeping: 10,
					filename: Path.resolve(dir,"./{YYYYMM}/temp."+id+".{x}.tmp")
				}
			}],
			separate: false,
			buffering: false,
			disableLoggingNotices: true,
			historyFormatter: "default",
			historySizeLimit: 200,
		});
		await Log.start();

		Log.info("Testing formatting 1...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Testing formatting 2...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Testing formatting 3...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Testing formatting 4...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Testing formatting 5...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Testing formatting 6...");
		await AwesomeUtils.Promise.sleep(30);

		await Log.stop();

		let files = FS.readdirSync(dir);
		let found = files.some((file)=>{
			return file.startsWith("temp."+id+".") && file.endsWith(".tmp");
		});

		assert(!found);
	});
});
