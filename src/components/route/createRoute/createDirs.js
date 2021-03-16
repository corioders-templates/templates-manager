const { mkdir } = require('fs/promises');
const { resolve } = require('path');

exports.createDirs = async function (path) {
	await mkdir(path);
	await mkdir(resolve(path, 'assets'));
	await mkdir(resolve(path, 'components'));
	await mkdir(resolve(path, 'routes'));
	await mkdir(resolve(path, 'store'));
};
