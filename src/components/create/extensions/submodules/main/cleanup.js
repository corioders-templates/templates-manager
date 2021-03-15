const { resolve } = require('path');
const { MAIN_REPO } = require('../../../../common/paths');
const { updateDependabot } = require('../shared/updateDependabot');

exports.cleanup = async function (config) {
	await dependabot(config);
};

async function dependabot(config) {
	const repoPlatform = config.repoPlatform.toLowerCase();
	if (config.submodules.app != undefined && config.submodules.server != undefined) {
		await updateDependabot(resolve(MAIN_REPO(config.name), '.github', 'dependabot.yml'), 'tools', repoPlatform, false);
	} else if (config.submodules.app != undefined) {
		await updateDependabot(resolve(MAIN_REPO(config.name), '.github', 'dependabot.yml'), ['tools', 'server'], repoPlatform, false);
	} else if (config.submodules.server != undefined) {
		await updateDependabot(resolve(MAIN_REPO(config.name), '.github', 'dependabot.yml'), ['tools', 'app'], repoPlatform, false);
	}
}
