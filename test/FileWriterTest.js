// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for Log.
 */

"use strict";

const assert = require("assert");
const FS = require("fs");
const Path = require("path");

const Log = require("../src/Log");

describe("FileWriterTest",()=>{
	let testfile = Path.resolve(process.cwd(),"./test.log");

	beforeEach(()=>{
		Log.stop();
		Log.init({
			writers: [{
				name: "file-writer-test",
				type: "file",
				options: {
					filename: "./test.log"
				}
			}],
			disableLoggingNotices: true,
			historyFormatter: "default"
		});
	});

	afterEach(()=>{
		Log.stop();
	});

	it("create",function(){
		Log.start();
		Log.info("Test","Testing formatting...");
		assert(FS.statSync(testfile));
		FS.unlinkSync(testfile);
	});

	it("write",function(){
		Log.start();

		Log.info("Test","Testing formatting...");
		Log.info("Test","Testing argument formatting...",123,"abc",[456,"def"]);

		Log.stop();

		let content = FS.readFileSync(testfile);
		console.log(1,content);
		assert.deepStrictEqual(content,Log.history.join("\n"));
	});
});
