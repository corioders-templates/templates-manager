const { resolve } = require('path');
const { writeFileSync } = require('fs');

function save(selected, config) {
	const ROOT_DIR = resolve(__dirname, '..');
	const CONFIG_PATH = resolve(ROOT_DIR, 'data', 'userDefaultConfig.json');
	const CONFIG_SOURCE = JSON.stringify({ selected, ...config });
	writeFileSync(CONFIG_PATH, CONFIG_SOURCE);
}

exports.save = save;
