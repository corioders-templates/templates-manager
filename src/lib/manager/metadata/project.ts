import { readdir, lstat } from '@corioders/nodekit/fs';
import * as path from 'path';

const projectPathCache = new Map<string, string | null>();

export async function getProjectPath(currentFolderPath: string, metadataFileName: string, maxSearchDepth: number): Promise<string | null> {
	const cacheKey = `${currentFolderPath}_${metadataFileName}_${maxSearchDepth}`;
	const cached = projectPathCache.get(cacheKey);
	if (cached !== undefined) return cached;

	let projectPath: string | null = null;
	let found: boolean = false;

	const runner = async function (folderPath: string, searchDepth: number): Promise<void> {
		const folderNames = await readdir(folderPath);

		const runnerPromises = [];
		for (const fileOrFolderName of folderNames) {
			if (found) return;

			const fileOrFolderPath = path.join(folderPath, fileOrFolderName);
			const isFile = (await lstat(fileOrFolderPath)).isFile();

			if (isFile) {
				if (fileOrFolderName === metadataFileName) {
					projectPath = folderPath;
					found = true;
				}
			} else {
				if (searchDepth < maxSearchDepth && !found) runnerPromises.push(runner(fileOrFolderName, searchDepth++));
			}
		}
		await Promise.all(runnerPromises);
	};

	await runner(currentFolderPath, 0);

	projectPathCache.set(cacheKey, projectPath);
	return projectPath;
}
