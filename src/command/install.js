const { checkDir } = require('../util/fileSystem/checkDir');

const { APP_DIR, SERVER_DIR } = require('../components/common/paths');
const { spawnSync } = require('child_process');

exports.install = async function install(options) {
	if (!checkDir()) return;

	if (options.app == undefined && options.server == undefined && options.both == undefined) {
		options = await ask();
	} else if (options.hasOwnProperty('both')) {
		options = { app: true, server: true };
	}

	const chalk = require('chalk');
	console.log(chalk.blue.bold('Installing dependencies'));

	if (options.hasOwnProperty('app')) spawnSync('yarn', ['install'], { cwd: APP_DIR() });
	if (options.hasOwnProperty('server')) spawnSync('go', ['mod', 'download'], { cwd: SERVER_DIR() });
};

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
