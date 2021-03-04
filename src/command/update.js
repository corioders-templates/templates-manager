const { spawnSync } = require('child_process');
const { checkDir } = require('../util/fileSystem/checkDir');
const { PROJECT_DIR } = require('../components/common/paths');

exports.update = function () {
	if (!checkDir()) return;

	let { status: add } = spawnSync('git', ['pull', 'template'], { stdio: 'inherit', cwd: PROJECT_DIR() });
	if (add != 0) return;
};
