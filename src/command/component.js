const { createComponent } = require('../components/component/createComponent');
const { prepareName } = require('../components/component/prepareName');

exports.component = async function (componentName) {
	const { name, dirName, alias } = prepareName(componentName);
	await createComponent(dirName);
};
