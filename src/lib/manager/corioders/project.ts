import { mkdir, unlink, writeFile, exists } from '@corioders/nodekit/fs';
import { resolve } from 'path';
import simpleGit from 'simple-git';

export async function create(name: string, url: string, projectsStoragePath: string, pathsJsonFilename: string): Promise<void> {
	const exists = await projectExists(name, projectsStoragePath);
	if (exists) throw new Error(`Project with name ${name} already exists`);
	const projectPath = getProjectPath(name, projectsStoragePath);

	await mkdir(projectPath, { recursive: true });
	await writeFile(resolve(projectPath, pathsJsonFilename), '{}', { encoding: 'utf-8' });

	const git = simpleGit(projectPath);
	await git.init();
	await git.addRemote('origin', url);
}

export async function remove(name: string, projectsStoragePath: string): Promise<void> {
	const exists = await projectExists(name, projectsStoragePath);
	if (!exists) throw new Error(`Project with name ${name} doesn't exist`);

	await unlink(getProjectPath(name, projectsStoragePath));
}

async function projectExists(name: string, projectsStoragePath: string): Promise<boolean> {
	return await exists(getProjectPath(name, projectsStoragePath));
}

function getProjectPath(projectName: string, projectsStoragePath: string): string {
	return resolve(projectsStoragePath, projectName);
}
