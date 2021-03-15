const { rmdir } = require('fs/promises');
const { resolve } = require('path');
const { PROJECT_DIR } = require('../common/paths');

exports.cleanup = async function (config) {
	try {
		const repoPlatform = config.repoPlatform.toLowerCase();
		if (repoPlatform != 'github') await rmdir(resolve(PROJECT_DIR(config.name), '.github'), { recursive: true });
		if (repoPlatform != 'gitlab') await rmdir(resolve(PROJECT_DIR(config.name), '.gitlab'), { recursive: true });
	} catch (error) {
		console.error(error);
	}
};
