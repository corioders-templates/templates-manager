import { resolve } from 'path';

import { metadata } from '@/lib/constant/location/metadata';

import { downloader } from './downloader';
import { getRepoPath } from './importPath';
import { validateImportPath } from './importPath';

export async function whereToAbsolutePath(where: string): Promise<string> {
	validateImportPath(where);
	const repoPath = getRepoPath(where);
	await downloader(repoPath, resolve(metadata, repoPath));
	return resolve(metadata, where);
}
