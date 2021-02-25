const path = require('path');

const { spawnSync } = require('child_process');

const ROOT_DIR = process.cwd();
const APP_DIR = path.resolve(ROOT_DIR, 'app');
const SERVER_DIR = path.resolve(ROOT_DIR, 'server');

async function install(options) {
	if (options.app == undefined && options.server == undefined && options.both == undefined) {
		options = await ask();
	} else if (options.hasOwnProperty('both')) {
		options = { app: true, server: true };
	}

	if (options.hasOwnProperty('app')) spawnSync('yarn', ['install'], { stdio: 'inherit', cwd: APP_DIR });
	if (options.hasOwnProperty('server')) spawnSync('go', ['mod', 'download'], { stdio: 'inherit', cwd: SERVER_DIR });
}

exports.install = install;

async function ask() {
	const inquirer = require('inquirer');

	let answer = await inquirer.prompt({
		name: 'Install dependencies for',
		choices: ['app', 'server'],
		default: ['app', 'server'],
		type: 'checkbox',
	});

	const selected = answer['Install dependencies for'];

	if (selected.includes('app') && selected.includes('server')) {
		return { app: true, server: true };
	} else if (selected.includes('app')) {
		return { app: true };
	} else if (selected.includes('server')) {
		return { server: true };
	}
}
