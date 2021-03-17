const { addAlias } = require('../components/route/addAlias');
const { createRoute } = require('../components/route/createRoute/createRoute');
const { prepareName } = require('../components/route/prepareName');

exports.route = async function (componentName) {
	const { name, dirName, alias } = prepareName(componentName);
	await createRoute(name, dirName);
	await addAlias(alias, dirName);
};
