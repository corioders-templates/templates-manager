const inquirer = require('inquirer');
const { spawnSync } = require('child_process');
const path = require('path');

async function create() {
	const ROOT_DIR = path.resolve(__dirname, '..', '..');
	const templates = require(path.resolve(ROOT_DIR, 'templates.json'));
	const templatesNames = Object.getOwnPropertyNames(templates);
	let answer = await inquirer.prompt({
		name: 'Choose a template',
		choices: templatesNames,
		type: 'list',
	});

	const selected = templates[answer['Choose a template']];
	spawnSync('git', ['clone', selected.url, selected.name], { stdio: 'inherit' });
	const PROJECT_DIR = path.resolve(process.cwd(), selected.name);
	spawnSync('./configure', { cwd: PROJECT_DIR, stdio: 'inherit' });
}

exports.create = create;
