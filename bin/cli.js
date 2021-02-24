#!/usr/bin/env node

if (process.argv.includes('create')) {
	const { create } = require('../src/commands/create.js');
	create();
}

if (process.argv.includes('run')) {
	const { run } = require('../src/commands/run.js');
	run();
}

if (process.argv.includes('install')) {
	const { install } = require('../src/commands/install.js');
	install();
}
