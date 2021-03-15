const { resolve, basename } = require('path');
const { copyDir } = require('./copyDir');
const { SUBMODULE, MAIN_REPO } = require('../../../common/paths');
const { writeFile } = require('fs/promises');

exports.moveVscode = async function (submoduleName, projectName) {
	const MAIN_VSCODE_PATH = resolve(MAIN_REPO(projectName), '.vscode');
	const SUBMODULE_VSCODE_PATH = resolve(SUBMODULE(submoduleName, projectName), '.vscode');
	await copyDir(MAIN_VSCODE_PATH, SUBMODULE_VSCODE_PATH);
	await update(submoduleName, SUBMODULE_VSCODE_PATH);
};

async function update(submoduleName, SUBMODULE_VSCODE_PATH) {
	const vscode = {
		settings: require(resolve(SUBMODULE_VSCODE_PATH, 'settings.json')),
		launch: require(resolve(SUBMODULE_VSCODE_PATH, 'launch.json')),
	};
	for (let file in vscode) {
		vscode[file] = cleanFile(vscode[file], file, submoduleName);
		vscode[file] = updatePaths(vscode[file], submoduleName);
		await writeFile(resolve(SUBMODULE_VSCODE_PATH, `${file}.json`), JSON.stringify(vscode[file], null, 2), 'utf-8');
	}
}

function cleanFile(data, fileName, submoduleName) {
	if (fileName == 'settings') delete data.protoc;

	if (submoduleName == 'app') {
		if (fileName == 'launch') data.configurations.splice(2, 1);
	} else if (submoduleName == 'server') {
		if (fileName == 'settings') {
			delete data['files.exclude']['app/out/**/*.map'];
			delete data['path-intellisense.mappings'];
			delete data['eslint.workingDirectories'];
			delete data['prettier.configPath'];
			delete data['[javascript]'];
			delete data['[typescript]'];
		} else if (fileName == 'launch') data.configurations.splice(0, 2);
	}
	return data;
}

function updatePaths(data, submoduleName) {
	for (let el in data) {
		if ((typeof data[el] == 'object' && data[el] != null) || Array.isArray(data[el])) updatePaths(data[el], submoduleName);
		if ((typeof data[el] == 'string' || data[el] instanceof String) && data[el] != basename(data[el]) && data[el].search(new RegExp(`${submoduleName}.*`)) != -1)
			data[el] = updatePath(data[el], submoduleName);
		if ((typeof el == 'string' || el instanceof String) && el != basename(el) && el.search(new RegExp(`${submoduleName}.*`)) != -1) {
			data[updatePath(el, submoduleName)] = data[el];
			delete data[el];
		}
	}
	return data;
}

function updatePath(path, submoduleName) {
	path = path.split('/');
	path.splice(path.indexOf(submoduleName), 1);
	return path.join('/');
}
