const { spawnSync } = require('child_process');
const path = require('path');
const inquirer = require('inquirer');
const { save } = require('./save');
const { read } = require('./read');

let PROJECT_DIR, APP_DIR, TOOLS_DIR;

async function configure(selected) {
	const config = await input();
	if (!config) return;
	PROJECT_DIR = path.resolve(process.cwd(), config.name);
	APP_DIR = path.resolve(PROJECT_DIR, 'app');
	TOOLS_DIR = path.resolve(PROJECT_DIR, 'tools');
	clone(selected.url, config.name);
	await replacePhrases(config);
	git(config.url, selected.url);
	save(selected, config);
}

function clone(selectedUrl, name) {
	const { status: clone } = spawnSync('git', ['clone', selectedUrl, name]);
	if (clone != 0) return;
}

function git(url, templateUrl) {
	let { status: add } = spawnSync('git', ['add', '.'], { cwd: PROJECT_DIR });
	if (add != 0) return;
	let { status: commit } = spawnSync('git', ['commit', '-m', '"init"'], { cwd: PROJECT_DIR });
	if (commit != 0) return;
	let { status: origin } = spawnSync('git', ['remote', 'rename', 'origin', 'template'], { cwd: PROJECT_DIR });
	if (origin != 0) return;
	let { status } = spawnSync('git', ['remote', 'add', 'origin', url], { cwd: PROJECT_DIR });
	if (status != 0) return;
}

async function replacePhrases(config) {
	const JSON_PATH = path.resolve(APP_DIR, 'package.json');

	const templatePhrases = {
		name: '___TEMPLATE_PROJECT_NAME___',
		repositoryUrl: '___TEMPLATE_REPO_URL___',
		branches: '___TEMPLATE_BRANCHES___',
		license: '___TEMPLATE_PROJECT_LICENSE___',
		version: '___TEMPLATE_PROJECT_VERSION___',
		author: '___TEMPLATE_PROJECT_AUTHOR___',
	};

	await replace([templatePhrases.name, templatePhrases.repositoryUrl], [config.name, config.repository]);
	await replace([templatePhrases.license, templatePhrases.version, templatePhrases.author], [config.license, config.version, config.author], JSON_PATH);

	await Promise.all([
		replace(templatePhrases.branches, 'master|main|develop|deploy', path.resolve(TOOLS_DIR, 'config', '.husky', 'pre-push')),
		replace('# cd tools', 'cd tools', path.resolve(TOOLS_DIR, 'config', '.husky', 'commit-msg')),
		replace('open-pull-requests-limit: 0', 'open-pull-requests-limit: 5', path.resolve(PROJECT_DIR, '.github', 'dependabot.yml')),
	]);
}

async function replace(from, to, files = path.resolve(PROJECT_DIR, '**', '*')) {
	if (Array.isArray(from)) {
		for (let i in from) {
			from[i] = new RegExp(from[i], 'g');
		}
	} else from = new RegExp(from, 'g');

	const replace = require('replace-in-file');
	try {
		await replace({
			from,
			to,
			files,
			ignore: [
				path.resolve(APP_DIR, 'node_modules', '**', '*'),
				path.resolve(TOOLS_DIR, 'node_modules', '**', '*'),
				path.resolve(PROJECT_DIR, 'server', 'vendor', '**', '*'),
			],
		});
	} catch (error) {
		console.error('Error occurred:', error);
	}
}

async function input() {
	const defaultConfig = read();
	let config = {};
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
}

exports.configure = configure;
