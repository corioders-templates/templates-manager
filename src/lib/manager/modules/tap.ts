import { resolve, join } from 'path';

import { modulesFolder, tapsFile } from '@/lib/constant/location/modules';
import { exists } from '@/nodekit/fs';

import { download } from './download';
import { validateImportPath } from './importPath';

import { rmdir, lstat, readdir, readFile, writeFile } from 'fs/promises';

let tapsJsonCache: string[] | null = null;

export async function tap(importPath: string, modulesFolderPath: string, tapsFilePath: string): Promise<void> {
	validateImportPath(importPath);
	const taps = await getTaps(tapsFilePath);
	if (taps.includes(importPath)) throw new Error('Tap already exists');
	taps.push(importPath);
	await download(importPath, resolve(modulesFolderPath, importPath));
	await writeTapsFile(taps, tapsFilePath);
	await checkTap(importPath, modulesFolderPath);
}

export async function untap(importPath: string, modulesFolder: string, tapsFile: string): Promise<void> {
	validateImportPath(importPath);
	await rmdir(resolve(modulesFolder, importPath), { recursive: true });
	await removeEmptyDirectories(modulesFolder);
	const taps = await getTaps(tapsFile);
	const tap = taps.indexOf(importPath);
	if (tap < 0) return;
	taps.splice(tap, 1);
	await writeTapsFile(taps, tapsFile);
}

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

async function checkTap(importPath: string, modulesFolderPath: string): Promise<void> {
	const absoluteImportPath = resolve(modulesFolderPath, importPath);
	if ((await exists(resolve(absoluteImportPath, 'plugins.json'))) || (await exists(resolve(absoluteImportPath, 'templates.json')))) return;
	await untap(importPath);
	throw new Error(`This repository doesn't contain the required configs`);
}

export async function getTapsAbsolutePaths(): Promise<string[]> {
	const taps = await getTaps();
	const tapsAbsolutePaths = [];
	for (const tap of taps) tapsAbsolutePaths.push(resolve(modulesFolder, tap));
	return tapsAbsolutePaths;
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
