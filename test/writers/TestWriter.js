const Log = require("../../src/AwesomeLog");

const AbstractLogWriter = Log.AbstractLogWriter;

let written = [];

class TestWriter extends AbstractLogWriter {
	constructor(options) {
		super(options);
	}

	static get written() {
		return [].concat(written);
	}

	write(message/*,logentry*/) {
		written.push(message);
	}

	flush() {
		// implement if you need this.
	}

	close() {
		written = [];
	}
}

module.exports = TestWriter;

Log.defineWriter("test-writer",module.filename);