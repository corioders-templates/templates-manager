import { defaultProjectManager } from '@/lib/manager';

export default async function create(name: string): Promise<void> {
	const url = 'https://github.com/example-username/example-repo';
	// url should be changed in the future
	defaultProjectManager.createProject(name, url);
}
