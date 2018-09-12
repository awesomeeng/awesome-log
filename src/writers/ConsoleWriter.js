// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("AwesomeUtils");

const AbstractLogWriter = require("../AbstractLogWriter");

const $THEME = Symbol("theme");

class ConsoleWriter extends AbstractLogWriter {
	constructor(parent,name,levels,formatter,options) {
		options = AwesomeUtils.Object.extend({
			colorize: true,
			colorStyle: "level", // "line" or "level"
			colors: {
				ACCESS: "green",
				ERROR: "red",
				WARN: "yellow",
				INFO: "magenta",
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
		message = ""+message;
		if (this.options.colorize) {
			if (this.options.colorStyle==="level") process.stdout.write(message.replace(logentry.level.name,AwesomeUtils.ANSI.stylize(this[$THEME][logentry.level.name],(logentry.level.name)))+"\n");
			else process.stdout.write(AwesomeUtils.ANSI.stylize(this[$THEME][logentry.level.name],message)+"\n");
		}
		else process.stdout.write(message+"\n");
	}

	flush() {
		// intentionally blank
	}

	close() {
		// intentionally blank
	}
}

module.exports = ConsoleWriter;
