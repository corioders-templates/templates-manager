const inquirer = require('inquirer');
const path = require('path');
const { configure } = require('../configure');

async function create() {
	const ROOT_DIR = path.resolve(__dirname, '..', '..');
	const templates = require(path.resolve(ROOT_DIR, 'data', 'templates.json'));
	const templatesNames = Object.getOwnPropertyNames(templates);
	let answer = await inquirer.prompt({
		name: 'Choose a template',
		choices: templatesNames,
		type: 'list',
	});

	const selected = templates[answer['Choose a template']];
	configure(selected);
}

exports.create = create;
