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

	await replace([templatePhrases.name, templatePhrases.repositoryUrl], [config.name, config.repository]);
	await replace([templatePhrases.license, templatePhrases.version, templatePhrases.author], [config.license, config.version, config.author], JSON_PATH(true));

	await Promise.all([
		replace(templatePhrases.branches, 'master|main|develop|deploy', resolve(TOOLS_DIR(true), 'config', '.husky', 'pre-push')),
		replace('# cd tools', 'cd tools', resolve(TOOLS_DIR(true), 'config', '.husky', 'commit-msg')),
		replace('open-pull-requests-limit: 0', 'open-pull-requests-limit: 5', resolve(PROJECT_DIR(true), '.github', 'dependabot.yml')),
	]);
};

async function replace(from, to, files = resolve(PROJECT_DIR(true), '**', '*')) {
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
				resolve(APP_DIR(true), 'node_modules', '**', '*'),
				resolve(TOOLS_DIR(true), 'node_modules', '**', '*'),
				resolve(PROJECT_DIR(true), 'server', 'vendor', '**', '*'),
			],
		});
	} catch (error) {
		console.error('Error occurred:', error);
	}
}
