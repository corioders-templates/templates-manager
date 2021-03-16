const { createRoute } = require('../components/route/createRoute');
const { prepareName } = require('../components/route/prepareName');

exports.route = async function (componentName) {
	const { name, dirName, alias } = prepareName(componentName);
	await createRoute(dirName);
};
