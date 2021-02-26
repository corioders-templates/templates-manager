const { spawnSync } = require('child_process');
const { checkDir } = require('../components/common/checkDir');
const { STMUX_DIR, TOOLS_DIR, STMUX_PATH } = require('../components/common/paths');
exports.run = async function (options) {
	if (!checkDir()) return;

	if (options.app == undefined && options.server == undefined && options.both == undefined) {
		options = await ask();
	} else if (options.hasOwnProperty('app') && options.hasOwnProperty('server')) {
		options = { both: true };
	}

	if (options.hasOwnProperty('both')) {
		const { workaround } = require('../../more/stmux/workaround');
		const { status: install } = spawnSync('yarn', { cwd: STMUX_DIR });
		if (install != 0) return;
		workaround();
		const { status } = spawnSync('node', [STMUX_PATH, `-e ERROR`, `-m beep,system`, `-M true`, `-c line`, `--`, `[`, `yarn app`, `..`, `yarn server`, `]`], {
			stdio: 'inherit',
			cwd: TOOLS_DIR(),
		});
		if (status != 0) return;
	} else if (options.hasOwnProperty('app')) {
		const { status } = spawnSync('yarn', ['app'], { stdio: 'inherit', cwd: TOOLS_DIR() });
		if (status != 0) return;
	} else {
		const { status } = spawnSync('yarn', ['server'], { stdio: 'inherit', cwd: TOOLS_DIR() });
		if (status != 0) return;
	}
};

async function ask() {
	const inquirer = require('inquirer');
	let answer = await inquirer.prompt({
		name: 'Run',
		choices: ['app', 'server'],
		default: ['app'],
		type: 'checkbox',
	});

	const selected = answer['Run'];
	if (selected.includes('app') && selected.includes('server')) {
		return { both: true };
	} else if (selected.includes('app')) {
		return { app: true };
	} else if (selected.includes('server')) {
		return { server: true };
	}
}
