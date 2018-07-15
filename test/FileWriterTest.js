// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");
const FS = require("fs");
const Path = require("path");

const AwesomeUtils = require("AwesomeUtils");

const Log = require("../src/Log");

describe("FileWriterTest",()=>{
	beforeEach(()=>{
		Log.stop();

	});

	afterEach(()=>{
		Log.stop();
	});

	it("create",function(){
		let id = AwesomeUtils.Random.string(16);
		let testfile = Path.resolve(process.cwd(),"./temp."+id+".tmp");

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

		if (AwesomeUtils.FS.existsSync(testfile)) FS.unlinkSync(testfile);
	});

	it("write",function(){
		let id = AwesomeUtils.Random.string(16);
		let testfile = Path.resolve(process.cwd(),"./temp."+id+".tmp");

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

		if (AwesomeUtils.FS.existsSync(testfile)) FS.unlinkSync(testfile);
	});

	it("rotate",async function(){
		this.slow(300);

		let id = AwesomeUtils.Random.string(16);

		Log.init({
			writers: [{
				name: "file-writer-test",
				type: "file",
				options: {
					housekeeping: 10,
					filename: "./temp."+id+".{x}.tmp"
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

		let files = FS.readdirSync(process.cwd());
		let found = files.some((file)=>{
			let found = file.startsWith("temp."+id+".") && file.endsWith(".tmp");
			if (found) FS.unlinkSync(file);
			return found;
		});
		assert(!found);
	});
});
