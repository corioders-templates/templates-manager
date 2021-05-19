import { modulesManager } from '@/lib/manager';
import { create as createProject } from '@/lib/manager/corioders/project';

export default async function create(name: string): Promise<void> {
	await modulesManager.update();

	const url = 'https://github.com/example-username/example-repo';
	// url should be changed in the future
	createProject(name, url);
}
