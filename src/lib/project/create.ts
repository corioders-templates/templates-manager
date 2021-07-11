import { defaultProjectManager, defaultModulesManager } from '@/lib/manager';

export default async function create(name: string): Promise<void> {
	await defaultModulesManager.update();

	const url = 'https://github.com/example-username/example-repo';
	// url should be changed in the future
	defaultProjectManager.createProject(name, url);
}
