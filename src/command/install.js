const { checkDir } = require('../util/fileSystem/checkDir');

const { APP_DIR, SERVER_DIR, PROJECT_DIR } = require('../components/common/paths');
const { spawnSync } = require('child_process');
const { prepareOptions } = require('../components/common/prepareOptions');
const { existsSync } = require('fs');
const { resolve } = require('path');

exports.install = async function install(options) {
	options = await prepareOptions(options);
	if (!checkDir(options)) return;
	const submodule = existsSync(resolve(PROJECT_DIR(), '.submodule'));

	const chalk = require('chalk');
	console.log(chalk.blue.bold('Installing dependencies'));

	if (!submodule) {
		if (options.hasOwnProperty('app')) spawnSync('yarn', ['install'], { cwd: APP_DIR() });
		if (options.hasOwnProperty('server')) spawnSync('go', ['mod', 'download'], { cwd: SERVER_DIR() });
	} else {
		if (options.hasOwnProperty('app')) spawnSync('yarn', ['install'], { cwd: PROJECT_DIR() });
		if (options.hasOwnProperty('server')) spawnSync('go', ['mod', 'download'], { cwd: PROJECT_DIR() });
	}
};
