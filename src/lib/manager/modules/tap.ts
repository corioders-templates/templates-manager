import { rmdir, lstat, readdir, readFile, writeFile, exists } from '@corioders/nodekit/fs';
import { resolve, join } from 'path';

import { download } from './download';
import { validateImportPath } from './importPath';

let tapsJsonCache: string[] | null = null;

export async function tap(importPath: string, downloadsFolderPath: string, tapsFilePath: string): Promise<void> {
	validateImportPath(importPath);
	const taps = await getTaps(tapsFilePath);
	if (taps.includes(importPath)) throw new Error('Tap already exists');
	taps.push(importPath);
	await download(importPath, downloadsFolderPath);
	await writeTapsFile(taps, tapsFilePath);
	await checkTap(importPath, downloadsFolderPath, tapsFilePath);
}

export async function untap(importPath: string, downloadsFolderPath: string, tapsFilePath: string): Promise<void> {
	validateImportPath(importPath);
	const taps = await getTaps(tapsFilePath);
	const tap = taps.indexOf(importPath);
	if (tap < 0) throw new Error(`The tap ${importPath} doesn't exist`);
	taps.splice(tap, 1);
	await rmdir(resolve(downloadsFolderPath, importPath), { recursive: true });
	await removeEmptyDirectories(downloadsFolderPath);
	await writeTapsFile(taps, tapsFilePath);
}

/**
 * getTaps returns array of importPaths
 */
export async function getTaps(tapsFilePath: string): Promise<string[]> {
	if (tapsJsonCache !== null) return tapsJsonCache;

	let taps: string[] = [];
	if (await exists(tapsFilePath)) {
		const json = await readFile(tapsFilePath, { encoding: 'utf-8' });
		taps = JSON.parse(json) as string[];
	}
	tapsJsonCache = taps;
	return taps;
}

async function writeTapsFile(taps: string[], tapsFilePath: string): Promise<void> {
	tapsJsonCache = taps;
	await writeFile(tapsFilePath, JSON.stringify(taps, null, 2), { encoding: 'utf-8' });
}

/**
 * checkTap checks if the tap is valid (includes plugins.json or templates.json)
 */
async function checkTap(importPath: string, downloadsFolderPath: string, tapsFilePath: string): Promise<void> {
	const absoluteImportPath = resolve(downloadsFolderPath, importPath);
	if ((await exists(resolve(absoluteImportPath, 'plugins.json'))) || (await exists(resolve(absoluteImportPath, 'templates.json')))) return;
	await untap(importPath, downloadsFolderPath, tapsFilePath);
	throw new Error(`This repository doesn't contain the required configs`);
}

async function removeEmptyDirectories(directory: string): Promise<void> {
	const fileStats = await lstat(directory);
	if (!fileStats.isDirectory()) {
		return;
	}
	let fileNames = await readdir(directory);
	if (fileNames.length > 0) {
		const recursiveRemovalPromises = fileNames.map((fileName) => removeEmptyDirectories(join(directory, fileName)));
		await Promise.all(recursiveRemovalPromises);
		fileNames = await readdir(directory);
	}
	if (fileNames.length === 0) await rmdir(directory);
}
