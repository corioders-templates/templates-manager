const { spawnSync } = require('child_process');
const { resolve } = require('path');

async function run(options) {
	if (options.app == undefined && options.server == undefined && options.both == undefined) {
		options = await ask();
	} else if (options.hasOwnProperty('app') && options.hasOwnProperty('server')) {
		options = { both: true };
	}

	const TOOLS_DIR = resolve(process.cwd(), 'tools');
	if (options.hasOwnProperty('both')) {
		const STMUX_DIR = resolve(TOOLS_DIR, 'node_modules', 'stmux');
		const { status: install } = spawnSync('yarn', { cwd: STMUX_DIR });
		if (install != 0) return;
		const { status: workaround } = spawnSync('yarn', ['workaroundStmux'], { cwd: TOOLS_DIR });
		if (workaround != 0) return;
		const { status } = spawnSync('yarn', ['sideBySide'], { stdio: 'inherit', cwd: TOOLS_DIR });
		if (status != 0) return;
	} else if (options.hasOwnProperty('app')) {
		const { status } = spawnSync('yarn', ['app'], { stdio: 'inherit', cwd: TOOLS_DIR });
		if (status != 0) return;
	} else {
		const { status } = spawnSync('yarn', ['server'], { stdio: 'inherit', cwd: TOOLS_DIR });
		if (status != 0) return;
	}
}

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
exports.run = run;
