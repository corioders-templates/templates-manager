#!/usr/bin/env node

const inquirer = require('inquirer');
const { renameSync } = require('fs');
const { spawnSync, execSync } = require('child_process');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let PROJECT_DIR;

if (process.argv.includes('create')) {
	create();
}

async function create() {
	const templates = require(path.resolve(ROOT_DIR, 'templates.json'));
	const templatesNames = Object.getOwnPropertyNames(templates);
	let answer = await inquirer.prompt({
		name: 'Choose a template',
		choices: templatesNames,
		type: 'list',
	});

	const selected = templates[answer['Choose a template']];
	spawnSync('git', ['clone', selected.url, selected.name], { stdio: 'inherit' });
	PROJECT_DIR = path.resolve(process.cwd(), selected.name);
	spawnSync('./configure', { cwd: PROJECT_DIR, stdio: 'inherit' });
}
