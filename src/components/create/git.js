const { spawn } = require('../../util/spawn');
const { resolve } = require('path');
const { PROJECT_DIR, MAIN_REPO, TOOLS_DIR } = require('../common/paths');

exports.clone = async function (selectedUrl, name) {
	try {
		await spawn('git', ['clone', selectedUrl, name]);
	} catch (error) {
		console.error(error);
	}
};

exports.git = async function (url, name, isUsingSubmodules = false) {
	try {
		await spawn('ls', ['-a'], { cwd: !isUsingSubmodules ? TOOLS_DIR(name) : resolve(MAIN_REPO(name), 'tools') });
		await spawn('yarn', ['install'], { cwd: !isUsingSubmodules ? TOOLS_DIR(name) : resolve(MAIN_REPO(name), 'tools') });
		await spawn('git', ['add', '.'], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
		await spawn('git', ['commit', '-m', 'init', '--no-verify'], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
		await spawn('git', ['remote', 'rename', 'origin', 'template'], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
		await spawn('git', ['remote', 'set-url', '--push', 'template', 'no_push'], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
		await spawn('git', ['remote', 'add', 'origin', url], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
		await spawn('git', ['push', 'origin', 'master', '--no-verify'], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
	} catch (error) {
		console.error(error);
	}
};
