const { resolve } = require('path');
const { APP_DIR, PROJECT_DIR, TOOLS_DIR, JSON_PATH } = require('../common/paths');

exports.replacePhrases = async function (config) {
	const templatePhrases = {
		name: '___TEMPLATE_PROJECT_NAME___',
		repositoryUrl: '___TEMPLATE_REPO_URL___',
		branches: '___TEMPLATE_BRANCHES___',
		license: '___TEMPLATE_PROJECT_LICENSE___',
		version: '___TEMPLATE_PROJECT_VERSION___',
		author: '___TEMPLATE_PROJECT_AUTHOR___',
	};

	const { name } = config;

	try {
		await replace([templatePhrases.name, templatePhrases.repositoryUrl], [name, config.repository], resolve(PROJECT_DIR(name), '**', '*'), name);
		await replace(
			[templatePhrases.license, templatePhrases.version, templatePhrases.author],
			[config.license, config.version, config.author],
			JSON_PATH(name),
			name,
		);

		await Promise.all([
			replace(templatePhrases.branches, 'master|main|develop|deploy', resolve(TOOLS_DIR(name), 'config', '.husky', 'pre-push')),
			replace('# cd tools', 'cd tools', resolve(TOOLS_DIR(name), 'config', '.husky', 'commit-msg')),
			replace('open-pull-requests-limit: 0', 'open-pull-requests-limit: 5', resolve(PROJECT_DIR(name), '.github', 'dependabot.yml')),
		]);
	} catch (error) {
		console.error(error);
	}
};

async function replace(from, to, files, configName) {
	console.log(files);
	if (Array.isArray(from)) {
		for (let i in from) {
			from[i] = new RegExp(from[i], 'g');
		}
	} else from = new RegExp(from, 'g');

	const replace = require('replace-in-file');
	try {
		await replace({
			from,
			to,
			files,
			ignore: [
				resolve(APP_DIR(configName), 'node_modules', '**', '*'),
				resolve(TOOLS_DIR(configName), 'node_modules', '**', '*'),
				resolve(PROJECT_DIR(configName), 'server', 'vendor', '**', '*'),
			],
		});
	} catch (error) {
		console.error(error);
	}
}
