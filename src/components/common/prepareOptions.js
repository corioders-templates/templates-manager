exports.prepareOptions = async function (options, script) {
	if (options.app == undefined && options.server == undefined && options.both == undefined) {
		options = await ask(script);
	} else if (options.hasOwnProperty('both')) {
		options = { app: true, server: true };
	}
	return options;
};

async function ask(name) {
	const inquirer = require('inquirer');
	let answer = await inquirer.prompt({
		name,
		choices: ['app', 'server'],
		default: ['app', 'server'],
		type: 'checkbox',
	});

	const selected = answer['Run'];
	if (selected.includes('app') && selected.includes('server')) {
		return { app: true, server: true };
	} else if (selected.includes('app')) {
		return { app: true };
	} else if (selected.includes('server')) {
		return { server: true };
	}
}
