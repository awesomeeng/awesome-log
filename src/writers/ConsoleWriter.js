// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Colors = require("colors");
const Lodash = require("lodash");

const LogWriter = require("../LogWriter");

const $THEME = Symbol("theme");

class ConsoleWriter extends LogWriter {
	constructor(parent,name,levels,formatter,options) {
		options = Lodash.extend({
			colorize: true,
			colorStyle: "level", // "line" or "level"
			colors: {
				ACCESS: "green",
				ERROR: "red",
				WARN: "yellow",
				INFO: "white",
				DEBUG: "cyan",
			}
		},options);

		super(parent,"Console",name,levels,formatter,options);
		if (this.options.colorize) {
			let theme = {};
			parent.levels.forEach((level)=>{
				theme[level.name] = "reset";
			});
			Object.keys(this.options.colors||{}).forEach((level)=>{
				if (!theme[level]) return;
				theme[level] = this.options.colors[level];
			});
			this[$THEME] = theme;
		}
	}

	write(message,logentry) {
		/*eslint no-console: off */
		if (this.options.colorize) {
			if (this.options.colorStyle==="level") console.log(message.replace(logentry.level.name,Colors.stylize(logentry.level.name,this[$THEME][logentry.level.name])));
			else console.log(Colors.stylize(message,this[$THEME][logentry.level.name]));
		}
		else console.log(message);
	}

	flush() {
		// intentionally blank
	}

	close() {
		// intentionally blank
	}
}

module.exports = ConsoleWriter;
