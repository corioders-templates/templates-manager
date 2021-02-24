#!/usr/bin/env node
const { create } = require('./commands/create.js');

if (process.argv.includes('create')) {
	create();
}
