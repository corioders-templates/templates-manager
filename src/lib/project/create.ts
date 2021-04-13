import { create as createProject } from '@/lib/coriodersManager/project';
import update from '@/lib/metadataManager/update';

export default function create(name: string): void {
	update();
	const url = 'https://github.com/example-username/example-repo';
	// url should be changed in the future
	createProject(name, url);
}
