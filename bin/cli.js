#!/usr/bin/env node

if (process.argv.includes('create')) {
	const { create } = require('../src/commands/create.js');
	create();
}

if (process.argv.includes('run')) {
	const { run } = require('../src/commands/run.js');
	run();
}
