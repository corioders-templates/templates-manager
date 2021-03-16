const { existsSync } = require('fs');
const { mkdir } = require('fs/promises');
const { resolve } = require('path');
const { PROJECT_DIR, APP_DIR } = require('../common/paths');

exports.createRoute = async function (dirName) {
	const isSubmodule = existsSync(resolve(PROJECT_DIR(), '.submodule'));
	const ROUTE_DIR = resolve(!isSubmodule ? APP_DIR() : PROJECT_DIR(), 'src', 'routes', dirName);
	await mkdir(ROUTE_DIR);
};
