const { resolve } = require('path');

function read() {
	const ROOT_DIR = resolve(__dirname, '..');
	const json = require(resolve(ROOT_DIR, 'data', 'userDefaultConfig.json'));
	console.log(json);
	return json;
}

exports.read = read;
