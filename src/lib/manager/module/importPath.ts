import { resolve } from 'path';
import simpleGit from 'simple-git';

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

	const { importPathWithoutVersion } = importPathToImportVersion(importPath);
	return resolve(downloadFolderPath, importPathWithoutVersion);
}

export async function importPathToModuleVersion(importPath: string, downloadFolderPath: string): Promise<string> {
	const absolutePath = await importPathToAbsolute(importPath, downloadFolderPath);
	const git = simpleGit(absolutePath);
	const version = await git.revparse('HEAD');
	return version;
}

export interface ImportPathToImportVersionReturn {
	importPathWithoutVersion: string;
	version: string | null;
}

// Import path with version looks like this: github.com/user/repo/directory@optionalVersion, were optionalVersion is something that can be checked out by git.
export function importPathToImportVersion(importPath: string): ImportPathToImportVersionReturn {
	let version: string | null = null;
	const importPathVersionArray = importPath.split('@');

	if (importPathVersionArray.length !== 1) {
		version = importPathVersionArray[importPathVersionArray.length - 1];

		// Remove version.
		importPathVersionArray.pop();
	}

	const importPathWithoutVersion = importPathVersionArray.join('@');
	return {
		version,
		importPathWithoutVersion,
	};
}

export function validateImportPath(importPath: string): void {
	if (importPath.includes('http://') || importPath.includes('https://') || importPath.includes('git@') || importPath.includes('.git'))
		throw new Error(`Invalid import path`);
}
