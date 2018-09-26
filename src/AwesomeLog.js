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

const instances = {};
let root = null;

class AwesomeLog {
	/**
	 * @private
	 * @constructor
	 */
	constructor() {
		let id = AwesomeUtils.VM.executionSource(3);
		let instance = instances[id];
		console.log("new",id,!!instance);
		console.log("stack",AwesomeUtils.VM.executionStack());
		/**
		 * @private
		 */
		const init = function init(config) {
			instance = new LogInstance(id,root);
			if (!root) root = instance;
			instances[id] = instance;
			instance.init(config);
		};

		/**
		 * @private
		 */
		const get = function get(target,prop) {
			if (prop==="init") return init;
			else if (prop==="AbstractLogWriter") return AbstractLogWriter;
			else if (prop==="AbstractLogFormatter") return AbstractLogFormatter;
			else if (prop==="defineWriter") return LogExtensions.defineWriter.bind(LogExtensions);
			else if (prop==="defineFormatter") return LogExtensions.defineFormatter.bind(LogExtensions);
			else if (prop==="initialized") return !!instance;

			if (!instance) throw new Error("AwesomeLog has not been initialized.");

			// functions need to be bound or this fails.
			if (instance[prop] instanceof Function) return instance[prop].bind(instance);
			// otherwise
			return instance[prop];
		};

		/**
		 * @private
		 */
		const has = function has(target,prop) {
			if (!instance) return false;
			return instance[prop]!==undefined;
		};

		/**
		 * @private
		 */
		const getOwnPropertyDescriptor = function getOwnPropertyDescriptor(target,prop) {
			if (!instance) throw new Error("AwesomeLog has not been initialized.");
			return Object.getOwnPropertyDescriptor(instance,prop);
		};

		const ownKeys = function ownKeys() {
			return [].concat(Object.getOwnPropertyNames(instance),Object.getOwnPropertySymbols(instance));
		};

		return new Proxy({},{
			get,
			has,
			getOwnPropertyDescriptor,
			ownKeys
		});
	}
}

module.exports = AwesomeLog;
