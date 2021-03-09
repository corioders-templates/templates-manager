const { spawn } = require('../../util/spawn');
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
		if (!isUsingSubmodules) await spawn('yarn', ['install'], { cwd: TOOLS_DIR(name) });
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
