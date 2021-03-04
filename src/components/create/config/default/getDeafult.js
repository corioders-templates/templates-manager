const { read } = require('./read');
exports.getDefault = function (name) {
	const config = read();
	if (config.name == undefined) return false;

	config.name = name;
	config.ghRepo = name;

	let repository = config.repository.split('/');
	repository[2] = name;
	config.repository = repository.join('/');

	let url = config.url.split('/');
	url[url.length - 1] = url[0].includes('git@') ? `${name}.git` : name;
	config.url = url.join('/');

	return config;
};
