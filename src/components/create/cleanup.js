const { rename, rmdir } = require('fs/promises');
const { PROJECT_DIR, MAIN_REPO } = require('../common/paths');

exports.cleanup = async function (name) {
	try {
		const tempDirName = `.temp${name}ProjectDir`;
		await rename(MAIN_REPO(name, name), PROJECT_DIR(tempDirName));
		await rmdir(PROJECT_DIR(name), { recursive: true });
		await rename(PROJECT_DIR(tempDirName), PROJECT_DIR(name));
	} catch (error) {
		console.error(error);
	}
};
