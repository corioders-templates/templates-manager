const inquirer = require('inquirer');
exports.prompt = async function (name, type, choices = undefined, defaultValue = undefined, validate = undefined) {
	const answer = await inquirer.prompt({ name, type, choices, default: defaultValue, validate });
	return answer[name];
};
