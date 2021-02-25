const { resolve } = require('path');
const { writeFileSync } = require('fs');

function clear() {
	const ROOT_DIR = resolve(__dirname, '..');
	const CONFIG_PATH = resolve(ROOT_DIR, 'data', 'userDefaultConfig.json');
	writeFileSync(CONFIG_PATH, '{}');
}

clear();
