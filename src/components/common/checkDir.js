const { existsSync } = require('fs');
const { APP_DIR, SERVER_DIR, TOOLS_DIR } = require('./paths');

exports.checkDir = function () {
	console.log(APP_DIR());
	console.log(SERVER_DIR());
	console.log(TOOLS_DIR());
	if (!existsSync(TOOLS_DIR()) || !existsSync(APP_DIR()) || !existsSync(SERVER_DIR())) {
		const chalk = require('chalk');

		console.error(chalk.red('You have to run this command in project the root dir!'));
		return false;
	}
	return true;
};
