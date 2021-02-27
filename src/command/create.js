const figlet = require('figlet');
const chalk = require('chalk');
const ora = require('ora');
const { input } = require('../components/create/input/input');
const { clone, git } = require('../components/create/git');
const { replacePhrases } = require('../components/create/replacePhrases');
const { save } = require('../components/create/save');

exports.create = async function () {
	console.clear();
	console.log(chalk.blue.bold(figlet.textSync('Corioders CLI', { horizontalLayout: 'full' })));

	const spinner = ora('Creating your project');
	spinner.color = 'blue';

	const config = await input();
	if (!config) return;

	spinner.start();

	await clone(config.template.url, config.name);
	await save(config.template, config);
	await replacePhrases(config);
	await git(config.url, config.name);

	spinner.stop();
};
