const { spawnSync } = require('child_process');
const { resolve } = require('path');

async function run() {
	let { status } = spawnSync('yarn', ['install'], { stdio: 'inherit', cwd: __dirname });
	if (status != 0) return;
	console.log();

	const inquirer = require('inquirer');

	let answer = await inquirer.prompt({
		name: 'Run',
		choices: ['app', 'server'],
		default: ['app'],
		type: 'checkbox',
	});

	const selected = answer['Run'];
	const TOOLS_DIR = resolve(process.cwd(), 'tools');
	if (selected.includes('app') && selected.includes('server')) {
		const STMUX_DIR = resolve(TOOLS_DIR, 'node_modules', 'stmux');
		const { status: install } = spawnSync('yarn', { cwd: STMUX_DIR });
		if (install != 0) return;
		const { status: workaround } = spawnSync('yarn', ['workaroundStmux'], { cwd: TOOLS_DIR });
		if (workaround != 0) return;
		const { status } = spawnSync('yarn', ['sideBySide'], { stdio: 'inherit', cwd: TOOLS_DIR });
		if (status != 0) return;
	} else if (selected.includes('app')) {
		const { status } = spawnSync('yarn', ['app'], { stdio: 'inherit', cwd: TOOLS_DIR });
		if (status != 0) return;
	} else {
		const { status } = spawnSync('yarn', ['server'], { stdio: 'inherit', cwd: TOOLS_DIR });
		if (status != 0) return;
	}
}

exports.run = run;
