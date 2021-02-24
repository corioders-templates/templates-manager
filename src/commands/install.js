const path = require('path');
const inquirer = require('inquirer');

const { spawnSync } = require('child_process');

const ROOT_DIR = process.cwd();
const APP_DIR = path.resolve(ROOT_DIR, 'app');
const SERVER_DIR = path.resolve(ROOT_DIR, 'server');

async function install() {
	answer = await inquirer.prompt({
		name: 'Install dependencies for',
		choices: ['app', 'server'],
		default: ['app', 'server'],
		type: 'checkbox',
	});

	const selected = answer['Install dependencies for'];
	if (selected.includes('app')) spawnSync('yarn', ['install'], { stdio: 'inherit', cwd: APP_DIR });
	if (selected.includes('server')) spawnSync('go', ['mod', 'download'], { stdio: 'inherit', cwd: SERVER_DIR });
}

exports.install = install;
