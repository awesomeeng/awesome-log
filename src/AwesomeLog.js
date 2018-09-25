// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const LogInstance = require("./LogInstance");
const LogExtensions = require("./LogExtensions");
const AbstractLogWriter = require("./AbstractLogWriter");
const AbstractLogFormatter = require("./AbstractLogFormatter");

/**
 * AwesomeLog is a singleton class that propagates all calls against
 * it to a specific instance of LogInstance based on the scope. (See
 * [Scope](./docs/Scope.md) for details about Scopes).
 *
 * @borrows LogExtensions#defineWriter as defineWriter
 * @borrows LogExtensions#defineFormatter as defineFormatter
 *
 * @borrows LogInstance#AbstractLogWriter as AbstractLogWriter
 * @borrows LogInstance#AbstractLogFormatter as AbstractLogFormatter
 * @borrows LogInstance#id as id
 * @borrows LogInstance#initialized as initialized
 * @borrows LogInstance#running as running
 * @borrows LogInstance#config as config
 * @borrows LogInstance#history as history
 * @borrows LogInstance#historySizeLimit as historySizeLimit
 * @borrows LogInstance#levels as levels
 * @borrows LogInstance#levelNames as levelNames
 * @borrows LogInstance#init as init
 * @borrows LogInstance#start as start
 * @borrows LogInstance#stop as stop
 * @borrows LogInstance#pause as pause
 * @borrows LogInstance#resume as resume
 * @borrows LogInstance#clearHistory as clearHistory
 * @borrows LogInstance#getLevel as getLevel
 * @borrows LogInstance#log as log
 * @borrows LogInstance#captureSubProcess as captureSubProcess
 * @borrows LogInstance#releaseSubProcess as releaseSubProcess
 *
 * @borrows AwesomeLog#uninit as uninit
 */
class AwesomeLog {
	/**
	 * @private
	 * @constructor
	 */
	constructor() {
		let instances = {};

		/**
		 * @private
		 */
		const init = function init(config) {
			let parent = getInstance();

			let id = AwesomeUtils.Module.source(3);
			let instance = new LogInstance(id,parent);

			instances[id] = instance;
			instance.init(config);
		};

		/**
		 * Removes a scoped instance of AwesomeLog. This function should
		 * generally not be need and can have odd side effects, so use
		 * with discretion.
		 *
		 * @param  {string} id
		 * @return {void}
		 */
		const uninit = function uninit(id) {
			id = id || AwesomeUtils.Module.source(3);
			delete instances[id];
		};

		/**
		 * @private
		 */
		const getInstance = function getInstance() {
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

			return null;
		};

		/**
		 * @private
		 */
		const get = function get(target,prop) {
			if (prop==="init") return init;
			else if (prop==="uninit") return uninit;
			else if (prop==="AbstractLogWriter") return AbstractLogWriter;
			else if (prop==="AbstractLogFormatter") return AbstractLogFormatter;
			else if (prop==="defineWriter") return LogExtensions.defineWriter.bind(LogExtensions);
			else if (prop==="defineFormatter") return LogExtensions.defineFormatter.bind(LogExtensions);

			let instance = getInstance();
			if (prop==="initialized") return !!instance;
			if (!instance) throw new Error("AwesomeLog has not been initialized.");

			// functions need to be bound or this fails.
			if (instance[prop] instanceof Function) return instance[prop].bind(instance);

			return instance[prop];
		};

		/**
		 * @private
		 */
		const has = function has(target,prop) {
			let instance = getInstance();
			if (!instance) return false;

			return instance[prop]!==undefined;
		};

		/**
		 * @private
		 */
		const getOwnPropertyDescriptor = function getOwnPropertyDescriptor(target,prop) {
			let instance = getInstance();
			if (!instance) throw new Error("AwesomeLog has not been initialized.");

			return Object.getOwnPropertyDescriptor(instance,prop);
		};

		const ownKeys = function ownKeys() {
			let instance = getInstance();

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
