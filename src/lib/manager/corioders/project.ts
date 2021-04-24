import { resolve } from 'path';
import simpleGit from 'simple-git';

import { storage, pathsJsonFilename } from '@/lib/constant/location/project';
import { mkdir, unlink, writeFile, exists } from '@/nodekit/fs';

export async function create(name: string, url: string): Promise<void> {
	const exists = await projectExists(name);
	if (exists) throw new Error(`Project with name ${name} already exists`);
	const projectPath = getProjectPath(name);

	await mkdir(projectPath, { recursive: true });
	await writeFile(resolve(projectPath, pathsJsonFilename), '{}', { encoding: 'utf-8' });

	const git = simpleGit(projectPath);
	await git.init();
	await git.addRemote('origin', url);
}

export async function remove(name: string): Promise<void> {
	const exists = await projectExists(name);
	if (!exists) throw new Error(`Project with name ${name} doesn't exist`);

	await unlink(getProjectPath(name));
}

async function projectExists(name: string): Promise<boolean> {
	return await exists(getProjectPath(name));
}

function getProjectPath(projectName: string): string {
	return resolve(storage, projectName);
}
