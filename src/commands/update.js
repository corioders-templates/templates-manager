const { spawnSync } = require('child_process');

function update() {
	const PROJECT_DIR = process.cwd();
	let { status: add } = spawnSync('git', ['pull', 'template'], { stdio: 'inherit', cwd: PROJECT_DIR });
	if (add != 0) return;
}

exports.update = update;
