import { mkdir, unlink, writeFile, exists } from '@corioders/nodekit/fs';
import { resolve } from 'path';
import simpleGit from 'simple-git';

export async function create(name: string, url: string, projectStoragePath: string, pathJsonFilename: string): Promise<void> {
	const exists = await projectExists(name, projectStoragePath);
	if (exists) throw new Error(`Project with name ${name} already exists`);
	const projectPath = getProjectPath(name, projectStoragePath);

	await mkdir(projectPath, { recursive: true });
	await writeFile(resolve(projectPath, pathJsonFilename), '{}', { encoding: 'utf-8' });

	const git = simpleGit(projectPath);
	await git.init();
	await git.addRemote('origin', url);
}

export async function remove(name: string, projectStoragePath: string): Promise<void> {
	const exists = await projectExists(name, projectStoragePath);
	if (!exists) throw new Error(`Project with name ${name} doesn't exist`);

	await unlink(getProjectPath(name, projectStoragePath));
}

async function projectExists(name: string, projectStoragePath: string): Promise<boolean> {
	return await exists(getProjectPath(name, projectStoragePath));
}

function getProjectPath(projectName: string, projectStoragePath: string): string {
	return resolve(projectStoragePath, projectName);
}
