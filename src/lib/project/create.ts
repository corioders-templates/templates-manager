import { create as createProject } from '@/lib/manager/corioders/project';
import { update } from '@/lib/manager/modules';

export default async function create(name: string): Promise<void> {
	await update();
	const url = 'https://github.com/example-username/example-repo';
	// url should be changed in the future
	createProject(name, url);
}
