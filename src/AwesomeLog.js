// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const LogInstance = require("./LogInstance");
const AbstractLogWriter = require("./AbstractLogWriter");
const AbstractLogFormatter = require("./AbstractLogFormatter");

class AwesomeLog {
	/**
	 * @constructor
	 */
	constructor() {
		let instances = {};

		const init = function init(config) {
			let parent = getInstance(true);

			let id = AwesomeUtils.Module.source(3);
			let instance = new LogInstance(id,parent);

			instances[id] = instance;
			instance.init(config);
		};

		const uninit = function uninit(id) {
			id = id || AwesomeUtils.Module.source(3);
			delete instances[id];
		};

		const getInstance = function getInstance(quiet=false) {
			let stack = AwesomeUtils.Module.stack(2);

			let instance = null;

			while (true) {
				let entry = stack.shift();
				if (!entry) break;

				let id = entry.source;
				instance = instances[id];
				if (instance) break;

				instance = null;
			}

			if (instance) return instance;

			if (quiet) return null;
			throw new Error("AwesomeLog has not been initialized.");
		};

		const get = function get(target,prop) {
			if (prop==="init") return init;
			else if (prop==="uninit") return uninit;
			else if (prop==="AbstractLogWriter") return AbstractLogWriter;
			else if (prop==="AbstractLogFormatter") return AbstractLogFormatter;

			let instance = getInstance();
			if (prop==="initialized") return !!instance;
			if (!instance) throw new Error("AwesomeLog has not been initialized.");


			// functions need to be bound or this fails.
			if (instance[prop] instanceof Function) return instance[prop].bind(instance);

			return instance[prop];
		};

		const has = function has(target,prop) {
			let instance = getInstance();
			if (!instance) throw new Error("AwesomeLog has not been initialized.");

			return instance[prop]!==undefined;
		};

		const getOwnPropertyDescriptor = function getOwnPropertyDescriptor(target,prop) {
			// this resolve an error with ownKeys requiring a 'prototype' member.
			// if (prop==="prototype") return {value: null, writable: false, enumerable: false, configurable: false};

			let instance = getInstance();
			if (!instance) throw new Error("AwesomeLog has not been initialized.");

			return Object.getOwnPropertyDescriptor(instance,prop);
		};

		const ownKeys = function ownKeys() {
			// we need to include ["prototype"] or we get wierd proxy errors.
			//
			let instance = getInstance();
			// if (!instance) return ["prototype"];

			return [].concat(Object.getOwnPropertyNames(instance),Object.getOwnPropertySymbols(instance));
		};

		const apply = {
		};

		return new Proxy(apply,{
			get,
			has,
			getOwnPropertyDescriptor,
			ownKeys
		});
	}
}




module.exports = new AwesomeLog();
