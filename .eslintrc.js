"use strict";

module.exports = {
	"extends": "eslint:recommended",
	parserOptions: {
		ecmaVersion: 8
	},
    env: {
        node: true,
        es6: true,
		mocha: true
    },
    rules: {
		"no-self-assign": [
			"off"
		],
		"no-async-promise-executor": "off",
        indent: [
            "error",
            "tab",
			{ "SwitchCase": 1 }
        ],
        semi: [
            "error",
            "always"
        ],
		"require-await": [
			"error"
		],
		"no-constant-condition": [
			"off"
		]
    }
};
