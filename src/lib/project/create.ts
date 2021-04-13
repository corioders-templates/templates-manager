import { create as createProject } from '@/lib/coriodersManager/project';
import update from '@/lib/metadataManager/update';

export default function create(name: string): void {
	update();
	createProject(name);
	
}
