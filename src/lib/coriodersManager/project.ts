import { storage, pathsJsonFilename } from '@/lib/constant/path/project';
import { exists } from '@/lib/fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { Repository, Remote } from 'nodegit';
import { resolve } from 'path';

export async function create(name: string): Promise<void> {
	const exists = await projectExists(name);
	if (exists) throw new Error(`Project with name ${name} already exists`);
	const projectPath = resolve(storage, name);

	await mkdir(projectPath, { recursive: true });
	await writeFile(resolve(projectPath, pathsJsonFilename), '{}');

	const projectRepo = await Repository.init(projectPath, 0);
	const config = await projectRepo.config();
	console.log(config);
	// await Remote.create(projectRepo,)
}

export async function remove(name: string): Promise<void> {
	const exists = await projectExists(name);
	if (!exists) throw new Error(`Project with name ${name} doesn't exist`);

	await unlink(resolve(storage, name));
}

async function projectExists(name: string): Promise<boolean> {
	return await exists(resolve(storage, name));
}
