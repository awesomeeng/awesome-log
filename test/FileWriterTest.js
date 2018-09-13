// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");
const FS = require("fs");
const Path = require("path");

const AwesomeUtils = require("@awesomeeng/awesome-utils");
const Log = require("../src/AwesomeLog");

describe("FileWriterTest",()=>{
	let id,dir,testfile;

	beforeEach(()=>{
		Log.stop();

		id = AwesomeUtils.Random.string(16);
		testfile = Path.resolve(process.cwd(),"./temp."+id+".tmp");
		dir = Path.resolve(process.cwd(),"./temp."+AwesomeUtils.Random.string(16));
	});

	afterEach(()=>{
		Log.stop();

		if (AwesomeUtils.FS.existsSync(testfile)) FS.unlinkSync(testfile);
		if (AwesomeUtils.FS.existsSync(dir)) AwesomeUtils.FS.recursiveRmdirSync(dir);
	});

	it("create",function(){
		Log.init({
			writers: [{
				name: "file-writer-test",
				type: "file",
				options: {
					housekeeping: "2 hours",
					filename: testfile
				}
			}],
			disableLoggingNotices: true,
			historyFormatter: "default",
			historySizeLimit: 200,
		});
		Log.start();

		Log.info("Test","Testing file creation...");

		assert(AwesomeUtils.FS.existsSync(testfile));

		Log.stop();

	});

	it("write",function(){
		Log.init({
			writers: [{
				name: "file-writer-test",
				type: "file",
				options: {
					housekeeping: "2 hours",
					filename: testfile
				}
			}],
			disableLoggingNotices: true,
			historyFormatter: "default",
			historySizeLimit: 200,
		});
		Log.start();

		new Array(99).fill(0).forEach((x,i)=>{
			Log.info("Test","Testing file writer "+i+"...");
		});

		Log.stop();

		assert(AwesomeUtils.FS.existsSync(testfile));
		let content = FS.readFileSync(testfile);

		assert.deepStrictEqual(content.toString("utf-8"),Log.history.join("\n")+"\n");
	});

	it("rotate",async function(){
		this.slow(3000);
		this.timeout(4000);

		let id = AwesomeUtils.Random.string(16);

		Log.init({
			writers: [{
				name: "file-writer-test",
				type: "file",
				options: {
					housekeeping: 10,
					filename: Path.resolve(dir,"./tempt."+id+".{x}.tmp")
				}
			}],
			disableLoggingNotices: true,
			historyFormatter: "default",
			historySizeLimit: 200,
		});
		Log.start();

		Log.info("Test","Testing formatting 1...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Test","Testing formatting 2...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Test","Testing formatting 3...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Test","Testing formatting 4...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Test","Testing formatting 5...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Test","Testing formatting 6...");
		await AwesomeUtils.Promise.sleep(30);

		Log.stop();

		let files = FS.readdirSync(dir);
		let found = files.some((file)=>{
			return file.startsWith("temp."+id+".") && file.endsWith(".tmp");
		});

		assert(!found);
	});

	it("rotate multi",async function(){
		this.slow(3000);
		this.timeout(4000);

		Log.init({
			writers: [{
				name: "file-writer-test",
				type: "file",
				options: {
					housekeeping: 10,
					filename: Path.resolve(dir,"./{YYYYMM}/temp."+id+".{x}.tmp")
				}
			}],
			disableLoggingNotices: true,
			historyFormatter: "default",
			historySizeLimit: 200,
		});
		Log.start();

		Log.info("Test","Testing formatting 1...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Test","Testing formatting 2...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Test","Testing formatting 3...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Test","Testing formatting 4...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Test","Testing formatting 5...");
		await AwesomeUtils.Promise.sleep(5);
		Log.info("Test","Testing formatting 6...");
		await AwesomeUtils.Promise.sleep(30);

		Log.stop();

		let files = FS.readdirSync(dir);
		let found = files.some((file)=>{
			return file.startsWith("temp."+id+".") && file.endsWith(".tmp");
		});

		assert(!found);
	});
});
