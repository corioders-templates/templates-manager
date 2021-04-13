import { resolve } from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

import { storage, pathsJsonFilename } from '@/lib/constant/path/project';
import { exists } from '@/lib/fs';

import { mkdir, unlink, writeFile } from 'fs/promises';

export async function create(name: string, url: string): Promise<void> {
	const exists = await projectExists(name);
	if (exists) throw new Error(`Project with name ${name} already exists`);
	const projectPath = resolve(storage, name);

	await mkdir(projectPath, { recursive: true });
	await writeFile(resolve(projectPath, pathsJsonFilename), '{}');

	const git: SimpleGit = simpleGit(projectPath);
	await git.init();
	await git.addRemote('origin', url);
}

export async function remove(name: string): Promise<void> {
	const exists = await projectExists(name);
	if (!exists) throw new Error(`Project with name ${name} doesn't exist`);

	await unlink(resolve(storage, name));
}

async function projectExists(name: string): Promise<boolean> {
	return await exists(resolve(storage, name));
}
