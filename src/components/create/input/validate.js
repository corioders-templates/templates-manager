exports.validateWhitespace = function (name) {
	return async function (input) {
		if (/\s/.test(input)) return `You cannot set string with whitespace as ${name}!`;
		if (input == '') return `You cannot set empty string as ${name}!`;
		return true;
	};
};

exports.validateVersion = function () {
	const { valid } = require('semver');
	return async function (input) {
		if (!valid(input)) return 'This is not valid version!';
		return true;
	};
};
