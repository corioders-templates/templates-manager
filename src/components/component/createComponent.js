const { existsSync } = require('fs');
const { mkdir } = require('fs/promises');
const { resolve } = require('path');
const { PROJECT_DIR, APP_DIR } = require('../common/paths');

exports.createComponent = async function (dirName) {
	const isSubmodule = existsSync(resolve(PROJECT_DIR(), '.submodule'));
	const COMPONENT_DIR = resolve(!isSubmodule ? APP_DIR() : PROJECT_DIR(), 'src', 'routes', dirName);
	await mkdir(COMPONENT_DIR);
};
