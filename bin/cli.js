#!/usr/bin/env node

const { program } = require('commander');
const { create } = require('../src/command/create.js');
const { run } = require('../src/command/run.js');
const { install } = require('../src/command/install.js');
const { update } = require('../src/command/update.js');

program.version('0.0.1');
program.command('create').alias('c').description('Create new project').action(create);
program
	.command('run')
	.alias('r')
	.description('Run your project')
	.option('-a, --app', 'Run app')
	.option('-s,--server', 'Run server')
	.option('-b,--both', 'Run app and server side by side')
	.action((options) => {
		run(options);
	});
program
	.command('install')
	.alias('i')
	.description('Install dependencies in your project')
	.option('-a, --app', 'Install in app')
	.option('-s,--server', 'Install in server')
	.option('-b,--both', 'Install in app and server')
	.action((options) => {
		install(options);
	});
program.command('update').description('Update template').action(update);

program.parse(process.argv);
