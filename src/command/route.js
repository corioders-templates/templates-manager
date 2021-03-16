const { createRoute } = require('../components/component/createRoute');
const { prepareName } = require('../components/component/prepareName');

exports.route = async function (componentName) {
	const { name, dirName, alias } = prepareName(componentName);
	await createRoute(dirName);
};
