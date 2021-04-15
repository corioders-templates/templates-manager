import { create as createProject } from '@/lib/manager/corioders/project';
import update from '@/lib/manager/metadata/update';

export default function create(name: string): void {
	update();
	const url = 'https://github.com/example-username/example-repo';
	// url should be changed in the future
	createProject(name, url);
}
