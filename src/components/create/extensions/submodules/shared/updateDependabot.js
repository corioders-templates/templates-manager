const { readFile, writeFile } = require('fs/promises');
const YAML = require('yaml');

exports.updateDependabot = async function (path, dirName, repoPlatform, isSubmodule) {
	if (repoPlatform != 'github') return;
	let config = await readFile(path, 'utf-8');
	config = new YAML.parse(config);
	let updates = config.updates.find((obj) => obj.directory == `/${dirName}`);
	if (isSubmodule) updates.directory = '/';
	config.updates = updates;
	await writeFile(path, YAML.stringify(config), 'utf-8');
};
