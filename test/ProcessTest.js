// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");
const CP = require("child_process");
const Path = require("path");
const Cluster = require("cluster");

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const Log = require("../src/AwesomeLog");

describe("Process",function(){
	let Worker;
	try {
		Worker = require('worker_threads');
	}
	catch (ex) {
		Worker = null;
	}

	beforeEach(()=>{
		require("../src/AwesomeLog").unrequire();
	});

	it("child_process",async function(){
		this.slow(1500);
		this.timeout(3000);

		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
		});
		await Log.start();

		let childpath = Path.resolve(Path.dirname(module.filename),"./processes/ProcessTestChild.js");
		let child = CP.fork(childpath,[],{});
		Log.captureSubProcess(child);

		await AwesomeUtils.Promise.sleep(500);
		child.kill();

		assert.strictEqual(Log.history.length,3);

		await Log.stop();
	});

	it("cluster",async function(){
		this.slow(1500);
		this.timeout(3000);

		Log.init({
			writers: [{
				name: "null",
				type: "null"
			}],
			disableLoggingNotices: true,
		});
		await Log.start();

		let workerpath = Path.resolve(Path.dirname(module.filename),"./processes/ProcessTestCluster.js");
		Cluster.setupMaster({
			exec: workerpath
		});
		let worker = Cluster.fork();
		Log.captureSubProcess(worker);

		await AwesomeUtils.Promise.sleep(500);
		worker.kill();

		assert.strictEqual(Log.history.length,3);

		await Log.stop();
	});

	// only runs if worker threads are enabled with the --experimental-worker flag.
	it("worker"+(Worker?"":"(not enabled, test skipped)"),async function(){
		this.slow(1500);
		this.timeout(3000);

		if (Worker) {
			Log.init({
				writers: [{
					name: "null",
					type: "null"
				}],
				disableLoggingNotices: true,
			});
			await Log.start();

			let workerpath = Path.resolve(Path.dirname(module.filename),"./processes/ProcessTestWorker.js");
			let worker = new Worker.Worker(workerpath);
			Log.captureSubProcess(worker);

			await AwesomeUtils.Promise.sleep(500);
			worker.terminate();

			assert.strictEqual(Log.history.length,3);

			await Log.stop();
		}
	});


});
