import { resolve, join } from 'path';

import { downloadsFolder, tapsFile } from '@/lib/constant/location/modules';
import { exists } from '@/nodekit/fs';

import { download } from './download';
import { validateImportPath } from './importPath';

import { rmdir, lstat, readdir, readFile, writeFile } from 'fs/promises';

let tapsJsonCache: string[] | null = null;

export async function tap(importPath: string): Promise<void> {
	validateImportPath(importPath);
	const taps = await getTaps();
	if (taps.includes(importPath)) throw new Error('Tap already exists');
	taps.push(importPath);
	await download(importPath, resolve(downloadsFolder, importPath));
	await writeTapsModules(taps);
	await checkTap(importPath);
}

export async function untap(importPath: string): Promise<void> {
	validateImportPath(importPath);
	const taps = await getTaps();
	const tap = taps.indexOf(importPath);
	if (tap < 0) throw new Error(`The tap ${importPath} doesn't exist`);
	taps.splice(tap, 1);
	await rmdir(resolve(downloadsFolder, importPath), { recursive: true });
	await removeEmptyDirectories(downloadsFolder);
	await writeTapsModules(taps);
}

export async function getTaps(): Promise<string[]> {
	if (tapsJsonCache !== null) return tapsJsonCache;

	let taps: string[] = [];
	if (await exists(tapsFile)) {
		const json = await readFile(tapsFile, { encoding: 'utf-8' });
		taps = JSON.parse(json) as string[];
	}
	tapsJsonCache = taps;
	return taps;
}

async function writeTapsModules(taps: string[]): Promise<void> {
	tapsJsonCache = taps;
	await writeFile(tapsFile, JSON.stringify(taps, null, 2), { encoding: 'utf-8' });
}

async function checkTap(importPath: string): Promise<void> {
	const absoluteImportPath = resolve(downloadsFolder, importPath);
	if ((await exists(resolve(absoluteImportPath, 'plugins.json'))) || (await exists(resolve(absoluteImportPath, 'templates.json')))) return;
	await untap(importPath);
	throw new Error(`This repository doesn't contain the required configs`);
}

export async function getTapsAbsolutePaths(): Promise<string[]> {
	const taps = await getTaps();
	const tapsAbsolutePaths = [];
	for (const tap of taps) tapsAbsolutePaths.push(resolve(downloadsFolder, tap));
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
