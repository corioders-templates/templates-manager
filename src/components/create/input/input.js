const inquirer = require('inquirer');
const { read } = require('../read');
const { validateWhitespace, validateVersion } = require('./validate');
const { TEMPLATES_PATH } = require('../../common/paths');

exports.input = async function (name) {
	const defaultConfig = read();
	let config = { name };

	const templates = require(TEMPLATES_PATH);
	const templatesNames = Object.getOwnPropertyNames(templates);
	const defaultTemplate =
		defaultConfig.template == undefined ? undefined : Object.keys(templates).find((key) => templates[key].name == defaultConfig.template.name);

	config.template = templates[await prompt('Choose a template', 'list', templatesNames, defaultTemplate)];
	config.repoPlatform = await prompt('Repo for this project is on', 'list', ['Github', 'Gitlab', 'Bitbucket'], defaultConfig.repoPlatform);

	config.ghUsername = await prompt(
		`${config.repoPlatform} username`,
		'input',
		undefined,
		defaultConfig.ghUsername,
		validateWhitespace(`${config.repoPlatform} username`),
	);

	config.ghRepo = await prompt(`${config.repoPlatform} repo name`, 'input', undefined, config.name, validateWhitespace(`${config.repoPlatform} name`));

	const platform = config.repoPlatform.toLowerCase();
	const extension = platform == 'bitbucket' ? 'org' : 'com';
	config.repository = `${platform}.${extension}/${config.ghUsername}/${config.ghRepo}`;
	const urlChoices = [
		`https://${platform}.${extension}/${config.ghUsername}/${config.ghRepo}`,
		`git@${platform}.${extension}:${config.ghUsername}/${config.ghRepo}.git`,
	];
	const defaultUrl = defaultConfig.url == undefined ? defaultConfig.url : defaultConfig.url.includes('git@') ? urlChoices[1] : urlChoices[0];

	config.url = await prompt('Which remote url are you using?', 'list', urlChoices, defaultUrl);
	config.license = await prompt('License', 'input', undefined, 'MIT', validateWhitespace('license'));
	config.version = await prompt('Version', 'input', undefined, '1.0.0', validateVersion());
	config.author = await prompt('Author', 'input', undefined, config.ghUsername, validateWhitespace('author'));

	return config;
};

async function prompt(name, type, choices = undefined, defaultValue = undefined, validate = undefined) {
	const answer = await inquirer.prompt({ name, type, choices, default: defaultValue, validate });
	return answer[name];
}
