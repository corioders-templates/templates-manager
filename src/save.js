const { resolve } = require('path');
const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { homedir } = require('os');

function save(selected, config) {
	const HOME_DIR = homedir();
	const CLI_DIR = resolve(HOME_DIR, '.corioders', 'cli');
	const CONFIG_PATH = resolve(CLI_DIR, 'userConfig.json');
	const CONFIG_SOURCE = JSON.stringify({ selected, ...config });
	if (!existsSync(CLI_DIR)) mkdirSync(CLI_DIR, { recursive: true });
	writeFileSync(CONFIG_PATH, CONFIG_SOURCE);
}

exports.save = save;
