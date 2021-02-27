const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { CONFIG_DIR, CONFIG_PATH } = require('../common/paths');

exports.save = async function (selected, config) {
	const CONFIG_SOURCE = JSON.stringify({ selected, ...config });
	if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
	writeFileSync(CONFIG_PATH, CONFIG_SOURCE);
};
