import { resolve } from 'path';

import { download } from './download';

export async function importPathToAbsolute(importPath: string, downloadsFolderPath: string): Promise<string> {
	validateImportPath(importPath);
	await download(importPath, downloadsFolderPath);
	return resolve(downloadsFolderPath, importPath);
}

export function validateImportPath(importPath: string): void {
	if (importPath.includes('http://') || importPath.includes('https://') || importPath.includes('git@') || importPath.includes('.git'))
		throw new Error(`Invalid import path`);
}
