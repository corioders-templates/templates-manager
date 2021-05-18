import { defaultModulesFolder } from '@/lib/constant/location/modules';
import { create as createProject } from '@/lib/manager/corioders/project';
import { ModulesManager } from '@/lib/manager/modules';

export default async function create(name: string): Promise<void> {
	const modulesManager = new ModulesManager(defaultModulesFolder);
	await modulesManager.update();

	const url = 'https://github.com/example-username/example-repo';
	// url should be changed in the future
	createProject(name, url);
}
