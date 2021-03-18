const { addAlias } = require('../components/route/addAlias');
const { addRoute } = require('../components/route/addRoute');
const { createRoute } = require('../components/route/createRoute/createRoute');
const { prepareName } = require('../components/route/prepareName');

exports.route = async function (componentName) {
	const { name, dirName, alias } = prepareName(componentName);
	await createRoute(name, alias, dirName);
	await Promise.all([addAlias(alias, dirName), addRoute(name, alias, dirName)]);
};
