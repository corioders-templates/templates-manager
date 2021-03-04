const { spawn } = require('../common/spawn');
const { PROJECT_DIR, MAIN_REPO } = require('../common/paths');

exports.clone = async function (selectedUrl, name) {
	try {
		await spawn('git', ['clone', selectedUrl, name]);
	} catch (error) {
		console.error(error);
	}
};

exports.git = async function (url, name, isUsingSubmodules = false) {
	try {
		await spawn('git', ['add', '.'], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
		await spawn('git', ['commit', '-m', 'init'], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
		await spawn('git', ['remote', 'rename', 'origin', 'template'], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
		await spawn('git', ['remote', 'set-url', '--push', 'template', 'no_push'], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
		await spawn('git', ['remote', 'add', 'origin', url], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
		await spawn('git', ['push', 'origin', 'master'], { cwd: !isUsingSubmodules ? PROJECT_DIR(name) : MAIN_REPO(name) });
	} catch (error) {
		console.error(error);
	}
};
