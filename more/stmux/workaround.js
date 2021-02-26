// A. the issue:
// when eslint webpack plugin sees file once
// Clicking CTRL+<activator> + r to restart and CTRL+<activator> + k to kill is very hard
// It would be better to only click CTRL + r to restart and CTRL + c to kill
// The solution:
// 1. add code to restart and kill tasks
// 2. rebuild

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const md5 = require('md5');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const stmuxPath = path.resolve(ROOT_DIR, 'node_modules/stmux');

const keysFile = {
	md5: {
		before: '35e51369fa0a68ea0504779a17f69d45',
		after: '31240ff4d72ea6d99a4b4ebcad69a138',
	},
	path: path.resolve(stmuxPath, 'src/stmux-9-keys.js'),
};

function workaround() {
	if (check(keysFile)) {
		const keysFileSource = fs.readFileSync(keysFile.path).toString();

		const modifiedKeysModuleSource = keysFileSource
			// =========================================================================
			// solution
			.replace(
				`        this.screen.on("keypress", (ch, key) => {\n            if ((prefixMode === 0 || prefixMode === 2) && key.full === \`C-\${this.argv.activator}\`) {`,
				`				 this.screen.on("keypress", (ch, key) => {\n            if (key.full == 'C-r') {\n            		this.terms[this.focused].terminate();\n            		this.terms[this.focused].spawn(this.terms[this.focused].stmuxShell, this.terms[this.focused].stmuxArgs);\n            		this.terminated--;\n            } else if (key.full == 'C-c') {\n            		this.terminate();\n            }\n            if ((prefixMode === 0 || prefixMode === 2) && key.full === \`C-\${this.argv.activator}\`) {`,
			);

		fs.writeFileSync(keysFile.path, modifiedKeysModuleSource);
		const { status } = spawnSync('yarn', ['build', '--force'], { stdio: 'inherit', cwd: stmuxPath });
		if (status != 0) return;
	}
}

function check(file) {
	const fileSource = fs.readFileSync(file.path).toString();
	const fileMd5 = md5(fileSource);
	if (fileMd5 == file.md5.after) return false;

	if (fileMd5 != file.md5.before) {
		console.error(`workarounds: eslint-webpack-plugin: lintedFiles: workaround not applied as md5 hash of file ${file.path} not matches`);
		return false;
	}

	return true;
}

exports.workaround = workaround;
