const { existsSync } = require('fs');
const { CONFIG_PATH } = require('../../../common/paths');

exports.read = function () {
	if (existsSync(CONFIG_PATH)) {
		const json = require(CONFIG_PATH);
		return json;
	}
	return {};
};
