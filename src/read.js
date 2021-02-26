const { existsSync } = require('fs');
const { homedir } = require('os');
const { resolve } = require('path');

function read() {
	const HOME_DIR = homedir();
	const CONFIG_PATH = resolve(HOME_DIR, '.corioders', 'cli', 'userConfig.json');
	if (existsSync(CONFIG_PATH)) {
		const json = require(CONFIG_PATH);
		return json;
	}
	return {};
}

exports.read = read;
