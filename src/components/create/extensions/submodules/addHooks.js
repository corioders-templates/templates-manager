const { resolve } = require('path');
const { spawn } = require('../../../../util/spawn');
const { copyDir } = require('./copyDir');
const { SUBMODULE, MAIN_REPO } = require('../../../common/paths');
const { writeFile } = require('fs/promises');
const { existsSync } = require('fs');

exports.addHooks = async function (submoduleName, projectName) {
	const JSON_PATH = resolve(SUBMODULE(submoduleName, projectName), 'package.json');
	if (!existsSync(JSON_PATH)) await writeFile(JSON_PATH, '{}', 'utf-8');
	await spawn('npx', ['add-dependencies', '@commitlint/cli', 'commitlint-config-jira', 'commitlint-plugin-jira-rules', '--dev'], {
		cwd: SUBMODULE(submoduleName, projectName),
	});
	const json = require(JSON_PATH);
	if (json.scripts == undefined) json.scripts = { postinstall: 'husky install ./hooks/.husky' };
	else json.scripts.postinstall = 'husky install ./hooks/.husky';
	await copyDir(resolve(MAIN_REPO(projectName), 'tools', 'config'), resolve(SUBMODULE(submoduleName, projectName), 'hooks'));
	await writeFile(JSON_PATH, JSON.stringify(json, null, 2), 'utf-8');
};
