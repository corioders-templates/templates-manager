const { copyDir } = require('./copyDir');
const { spawn } = require('../../../../util/spawn');
const { SUBMODULE, MAIN_REPO } = require('../../../common/paths');
const { sleep } = require('../../../../util/sleep');
const { rmdir } = require('fs').promises;
const { resolve } = require('path');
const { openGithub } = require('../../../common/openGithub');

exports.createSubmodule = async function (submoduleName, projectName, url, repoName, platform, spinner) {
	spinner.start();
	await copyDir(MAIN_REPO(projectName), SUBMODULE(submoduleName, projectName));
	await spawn('git', ['add', '.'], { cwd: SUBMODULE(submoduleName, projectName) });
	await spawn('git', ['commit', '-m', 'pre-submodule'], { cwd: SUBMODULE(submoduleName, projectName) });
	await spawn('git', ['filter-branch', '--subdirectory-filter', submoduleName, '--', '--all'], { cwd: SUBMODULE(submoduleName, projectName) });
	await spawn('git', ['remote', 'set-url', 'origin', url], { cwd: SUBMODULE(submoduleName, projectName) });
	spinner.stop();
	await openGithub(repoName, platform);
	spinner.start();
	while (true) {
		try {
			await sleep(5000);
			await spawn('git', ['push', 'origin', 'master'], { cwd: SUBMODULE(submoduleName, projectName) });
			break;
		} catch (e) {}
	}
	await spawn('git', ['rm', '-r', '--force', submoduleName], { cwd: MAIN_REPO(projectName) });
	await rmdir(resolve(MAIN_REPO(projectName), submoduleName), { recursive: true });
	await spawn('git', ['add', '.'], { cwd: MAIN_REPO(projectName) });
	await spawn('git', ['commit', '-m', 'pre-submodule'], { cwd: MAIN_REPO(projectName) });
	await spawn('git', ['submodule', 'add', url, submoduleName], { cwd: MAIN_REPO(projectName) });
	await spawn('git', ['submodule', 'update', '--init', '--recursive'], { cwd: MAIN_REPO(projectName) });
	spinner.stop();
};
