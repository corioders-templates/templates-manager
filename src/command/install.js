const { checkDir } = require('../util/fileSystem/checkDir');

const { APP_DIR, SERVER_DIR, PROJECT_DIR } = require('../components/common/paths');
const { spawnSync } = require('child_process');
const { prepareOptions } = require('../components/common/prepareOptions');
const { existsSync } = require('fs');
const { resolve } = require('path');
const { spawn } = require('../util/spawn');

exports.install = async function install(options) {
	try {
		options = await prepareOptions(options);
		if (!checkDir(options)) return;
		const submodule = existsSync(resolve(PROJECT_DIR(), '.submodule'));

		const chalk = require('chalk');
		console.log(chalk.blue.bold('Installing dependencies'));

		if (!submodule) {
			if (options.hasOwnProperty('app')) spawnSync('yarn', ['install'], { cwd: APP_DIR() });
			if (options.hasOwnProperty('server')) spawnSync('go', ['mod', 'download'], { cwd: SERVER_DIR() });
		} else {
			await spawn('yarn', ['install'], { cwd: resolve(PROJECT_DIR(), 'hooks') });
			if (options.hasOwnProperty('app')) await spawn('yarn', ['install'], { cwd: PROJECT_DIR() });
			if (options.hasOwnProperty('server')) await spawn('go', ['mod', 'download'], { cwd: PROJECT_DIR() });
		}
	} catch (error) {
		console.error(error);
	}
};
