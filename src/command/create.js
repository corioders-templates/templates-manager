const { input } = require('../components/create/input');
const { clone, git } = require('../components/create/git');
const { replacePhrases } = require('../components/create/replacePhrases');
const { save } = require('../components/create/save');

exports.create = async function () {
	const config = await input();
	if (!config) return;
	clone(config.template.url, config.name);
	await replacePhrases(config);
	git(config.url);
	save(config.template, config);
};
