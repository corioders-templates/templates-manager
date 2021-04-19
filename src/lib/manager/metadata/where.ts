import { resolve } from 'path';

import { metadataFolder } from '@/lib/constant/location/metadata';

import { download } from './download';
import { getRepoPath } from './importPath';
import { validateImportPath } from './importPath';

export async function whereToAbsolutePath(importPath: string): Promise<string> {
	validateImportPath(importPath);
	const repoPath = getRepoPath(importPath);
	await download(repoPath, resolve(metadataFolder, repoPath));
	return resolve(metadataFolder, importPath);
}
