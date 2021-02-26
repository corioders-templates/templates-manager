const { existsSync } = require('fs');
const { resolve } = require('path');

function checkDir() {
	const TOOLS_DIR = resolve(process.cwd(), 'tools');
	if (!existsSync(TOOLS_DIR) || !existsSync(resolve(process.cwd(), 'app')) || !existsSync(resolve(process.cwd(), 'server'))) {
		const chalk = require('chalk');

		console.error(chalk.red('You have to run this command in project the root dir!'));
		return false;
	}
	return true;
}

exports.checkDir = checkDir;
