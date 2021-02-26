const inquirer = require('inquirer');
const { read } = require('./read');
const { TEMPLATES_PATH } = require('../common/paths');

exports.input = async function () {
	const defaultConfig = read();
	let config = {};

	const templates = require(TEMPLATES_PATH);
	const templatesNames = Object.getOwnPropertyNames(templates);

	let answer = await inquirer.prompt({
		name: 'Choose a template',
		choices: templatesNames,
		default:
			defaultConfig.template == undefined ? defaultConfig.template : Object.keys(templates).find((key) => templates[key].name == defaultConfig.template.name),
		type: 'list',
	});

	config.template = templates[answer['Choose a template']];

	answer = await inquirer.prompt({
		name: 'Name of this project',
		type: 'input',
		validate: async (input) => {
			if (/\s/.test(input)) return `You cannot set string with whitespace as project name!`;
			if (input == '') return `You cannot set empty string as project name!`;
			return true;
		},
	});

	config.name = answer['Name of this project'];

	answer = await inquirer.prompt({
		name: 'Repo for this project is on',
		type: 'list',
		default: defaultConfig.repoPlatform,
		choices: ['Github', 'Gitlab', 'Bitbucket'],
	});

	config.repoPlatform = answer['Repo for this project is on'];

	answer = await inquirer.prompt({
		name: `${config.repoPlatform} username`,
		type: 'input',
		default: defaultConfig.ghUsername,
		validate: async (input) => {
			if (/\s/.test(input)) return `You cannot set string with whitespace as ${config.repoPlatform} username!`;
			if (input == '') return `You cannot set empty string as ${config.repoPlatform} username!`;
			return true;
		},
	});

	config.ghUsername = answer[`${config.repoPlatform} username`];

	answer = await inquirer.prompt({
		name: `${config.repoPlatform} repo name`,
		default: config.name,
		type: 'input',
		validate: async (input) => {
			if (/\s/.test(input)) return `You cannot set string with whitespace as ${config.repoPlatform} repo name!`;
			if (input == '') return `You cannot set empty string as ${config.repoPlatform} repo name!`;
			return true;
		},
	});

	config.ghRepo = answer[`${config.repoPlatform} repo name`];

	const platform = config.repoPlatform.toLowerCase();
	const extension = platform == 'bitbucket' ? 'org' : 'com';
	config.repository = `${platform}.${extension}/${config.ghUsername}/${config.ghRepo}`;

	const urlChoices = [
		`https://${platform}.${extension}/${config.ghUsername}/${config.ghRepo}`,
		`git@${platform}.${extension}:${config.ghUsername}/${config.ghRepo}.git`,
	];
	answer = await inquirer.prompt({
		name: 'Which remote url are you using?',
		type: 'list',
		default: defaultConfig.url == undefined ? defaultConfig.url : defaultConfig.url.includes('git@') ? urlChoices[1] : urlChoices[0],
		choices: urlChoices,
	});

	config.url = answer['Which remote url are you using?'];

	answer = await inquirer.prompt({
		name: 'License',
		default: 'MIT',
		type: 'input',
		validate: async (input) => {
			if (/\s/.test(input)) return `You cannot set string with whitespace as license!`;
			if (input == '') return `You cannot set empty string as license!`;
			return true;
		},
	});

	config.license = answer['License'];

	answer = await inquirer.prompt({
		name: 'Version',
		default: '1.0.0',
		type: 'input',
		validate: async (input) => {
			if (/\s/.test(input)) return `You cannot set string with whitespace as version!`;
			if (input == '') return `You cannot set empty string as version!`;
			return true;
		},
	});

	config.version = answer['Version'];

	answer = await inquirer.prompt({
		name: 'Author',
		default: config.ghUsername,
		type: 'input',
		validate: async (input) => {
			if (/\s/.test(input)) return `You cannot set string with whitespace as author!`;
			if (input == '') return `You cannot set empty string as author!`;
			return true;
		},
	});

	config.author = answer['Author'];

	return config;
};
