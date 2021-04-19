import { resolve } from 'path';

import { metadataFolder } from '@/lib/constant/location/metadata';

import { download } from './download';

export async function importPathToAbsolute(importPath: string): Promise<string> {
	validateImportPath(importPath);
	const repoPath = getRepoPath(importPath);
	await download(repoPath, resolve(metadataFolder, repoPath));
	return resolve(metadataFolder, importPath);
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
