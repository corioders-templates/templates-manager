const { resolve } = require('path');
const { spawn } = require('../../../../util/spawn');
const { copyDir } = require('./copyDir');
const { SUBMODULE, MAIN_REPO } = require('../../../common/paths');
const { writeFile } = require('fs/promises');
const { existsSync } = require('fs');

exports.addHooks = async function (submoduleName, projectName) {
	const HOOKS_PATH = resolve(SUBMODULE(submoduleName, projectName), 'hooks');
	const JSON_PATH = resolve(HOOKS_PATH, 'package.json');
	await copyDir(resolve(MAIN_REPO(projectName), 'tools', 'config'), resolve(HOOKS_PATH));
	if (!existsSync(JSON_PATH)) await writeFile(JSON_PATH, '{}', 'utf-8');
	await spawn('npx', ['add-dependencies', 'husky', '@commitlint/cli', 'commitlint-config-jira', 'commitlint-plugin-jira-rules', '--dev'], { cwd: HOOKS_PATH });
	const json = require(JSON_PATH);
	if (json.scripts == undefined) json.scripts = { postinstall: 'cd .. && husky install ./.husky' };
	else json.scripts.postinstall = 'cd .. && husky install ./.husky';
	await writeFile(JSON_PATH, JSON.stringify(json, null, 2), 'utf-8');
};
