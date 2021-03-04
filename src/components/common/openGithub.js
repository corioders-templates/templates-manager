const open = require('open');
const chalk = require('chalk');
const { copy } = require('copy-paste');
const { sleep } = require('./sleep');
const { prompt } = require('../create/input/input');

exports.openGithub = async function (repoName, platform) {
	console.log(
		`Please create repo for this submodule with name ${repoName} ${platform != 'bitbucket' ? '' : `without readme & gitignore and with default branch master`}`,
	);
	await copy(repoName);
	console.log(chalk.blue.bold(`You have it in your clipboard, just paste it on ${platform}`));
	await sleep(5000);

	let link = 'https://github.com/new';
	if (platform == 'gitlab') link = 'https://gitlab.com/projects/new#blank_project';
	if (platform == 'bitbucket') link = 'https://bitbucket.org/repo/create';
	await open(link);

	let isCreated = false;
	do {
		isCreated = await prompt(`Have you created the ${repoName} repo?`, 'confirm');
	} while (!isCreated);
};
