const { input } = require('./input/input');
const { loadDefault } = require('./loadDefault');

exports.handleOptions = async function (name, options) {
	if (options.default) {
		const config = loadDefault(name);
		if (!!config) return config;
	}
	return await input(name);
};
