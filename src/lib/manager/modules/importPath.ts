import { resolve } from 'path';

import { download } from './download';

export async function importPathToAbsolute(importPath: string, modulesFolderPath: string): Promise<string> {
	validateImportPath(importPath);
	const repoPath = getRepoPath(importPath);
	await download(repoPath, resolve(modulesFolderPath, repoPath));
	return resolve(modulesFolderPath, importPath);
}

export function getRepoPath(importPath: string): string {
	const importPathArray = importPath.split('/');
	const repoPath: string[] = [];
	for (let i = 0; i < 3; i++) repoPath.push(importPathArray[i]);
	return repoPath.join('/');
}

export function validateImportPath(importPath: string): void {
	if (importPath.includes('http://') || importPath.includes('https://') || importPath.includes('git@') || importPath.includes('.git'))
		throw new Error(`Invalid import path`);
}
