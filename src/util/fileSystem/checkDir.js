const { existsSync } = require('fs');
const { APP_DIR, SERVER_DIR, TOOLS_DIR } = require('../../components/common/paths');

exports.checkDir = function () {
	if (!existsSync(TOOLS_DIR()) || !existsSync(APP_DIR()) || !existsSync(SERVER_DIR())) {
		const chalk = require('chalk');

		console.error(chalk.red('You have to run this command in project the root dir!'));
		return false;
	}
	return true;
};
