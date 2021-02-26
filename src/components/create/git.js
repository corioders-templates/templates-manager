const { spawnSync } = require('child_process');
const { PROJECT_DIR } = require('../common/paths');

exports.clone = function (selectedUrl, name) {
	const { status: clone } = spawnSync('git', ['clone', selectedUrl, name]);
	if (clone != 0) return;
};

exports.git = function (url) {
	let { status: add } = spawnSync('git', ['add', '.'], { cwd: PROJECT_DIR(true) });
	if (add != 0) return;
	let { status: commit } = spawnSync('git', ['commit', '-m', '"init"'], { cwd: PROJECT_DIR(true) });
	if (commit != 0) return;
	let { status: origin } = spawnSync('git', ['remote', 'rename', 'origin', 'template'], { cwd: PROJECT_DIR(true) });
	if (origin != 0) return;
	let { status } = spawnSync('git', ['remote', 'add', 'origin', url], { cwd: PROJECT_DIR(true) });
	if (status != 0) return;
};
