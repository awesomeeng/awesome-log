// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractLogFormatter = require("../AbstractLogFormatter");

class CSVFormatter extends AbstractLogFormatter {
	constructor(parent) {
		super(parent);
	}

	// timestamp,"level",pid,"system","message",arg0,arg1,arg2,etc
	format(logentry) {
		let s = [];

		s.push(""+logentry.timestamp);
		s.push("\""+logentry.level.name+"\"");
		s.push(""+logentry.pid);
		s.push("\""+logentry.system+"\"");
		s.push("\""+logentry.message+"\"");
		if (logentry.args && logentry.args.length>0) s = s.concat(logentry.args.map((arg)=>{
			if (arg===null || arg===undefined) return "";
			else if (typeof arg==="string") return "\""+arg+"\"";
			else if (typeof arg==="number") return ""+arg;
			else if (typeof arg==="boolean") return ""+arg;
			else if (arg instanceof Date) return ""+arg.getTime();
			else if (arg instanceof Array) return "\""+this.formatCSVJSON(arg)+"\"";
			else if (arg instanceof Object) return "\""+this.formatCSVJSON(arg)+"\"";
			else return arg.toString();
		}));
		return s.join(",");
	}

	formatCSVJSON(obj) {
		let json = JSON.stringify(obj);
		json = json.replace(/"/g,'\\"');
		return json;
	}
}

module.exports = CSVFormatter;
