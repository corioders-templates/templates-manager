import { resolve } from 'path';

import { download } from './download';

export async function importPathToAbsolute(importPath: string, downloadFolderPath: string): Promise<string> {
	importPath = importPath.trim();

	// Exception for local paths.
	if (importPath.startsWith('local.')) {
		const localImportPath = importPath.replace('local.', '');
		if (localImportPath !== '') return localImportPath;
		return process.cwd();
	}

	validateImportPath(importPath);
	await download(importPath, downloadFolderPath);
	return resolve(downloadFolderPath, importPath);
}

export function validateImportPath(importPath: string): void {
	if (importPath.includes('http://') || importPath.includes('https://') || importPath.includes('git@') || importPath.includes('.git'))
		throw new Error(`Invalid import path`);
}
