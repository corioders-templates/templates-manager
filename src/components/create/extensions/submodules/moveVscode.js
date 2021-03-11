const { resolve } = require('path');
const { copyDir } = require('./copyDir');
const { SUBMODULE } = require('../../../common/paths');

exports.moveVscode = async function (submoduleName, projectName) {
	await copyDir(resolve(__dirname, 'vscode', submoduleName == 'app' ? '.appvscode' : '.servervscode'), resolve(SUBMODULE(submoduleName, projectName), '.vscode'));
};
