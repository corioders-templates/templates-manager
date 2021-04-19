import { resolve } from 'path';

import { metadataFolder } from '@/lib/constant/location/metadata';

import { download } from './download';
import { getRepoPath } from './importPath';
import { validateImportPath } from './importPath';

export async function whereToAbsolutePath(where: string): Promise<string> {
	validateImportPath(where);
	const repoPath = getRepoPath(where);
	await download(repoPath, resolve(metadataFolder, repoPath));
	return resolve(metadataFolder, where);
}
