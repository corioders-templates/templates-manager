const inquirer = require('inquirer');
const { spawnSync } = require('child_process');
const path = require('path');
const { configure } = require('../configure');

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
	configure(selected.url);
}

exports.create = create;
