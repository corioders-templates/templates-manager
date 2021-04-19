import { resolve, join } from 'path';

import { metadataFolder, tapsFile } from '@/lib/constant/location/metadata';
import { exists } from '@/nodekit/fs';

import { download } from './download';
import { validateImportPath } from './importPath';

import { rmdir, lstat, readdir, readFile, writeFile } from 'fs/promises';

export async function tap(importPath: string): Promise<void> {
	validateImportPath(importPath);
	await download(importPath, resolve(metadataFolder, importPath));
	const taps = await getTaps();
	taps.push(importPath);
	await writeTaps(taps);
	await checkTap(importPath);
}

export async function untap(importPath: string): Promise<void> {
	validateImportPath(importPath);
	await rmdir(resolve(metadataFolder, importPath), { recursive: true });
	await removeEmptyDirectories(metadataFolder);
	const taps = await getTaps();
	const tap = taps.indexOf(importPath);
	if (tap < 0) return;
	taps.splice(tap, 1);
	await writeTaps(taps);
}

export async function getTaps(): Promise<string[]> {
	let taps = [] as string[];
	if (await exists(tapsFile)) {
		const json = await readFile(tapsFile, { encoding: 'utf-8' });
		taps = JSON.parse(json) as string[];
	}
	return taps;
}

async function writeTaps(taps: string[]): Promise<void> {
	await writeFile(tapsFile, JSON.stringify(taps, null, 2), { encoding: 'utf-8' });
}

async function checkTap(importPath: string): Promise<void> {
	const absoluteImportPath = resolve(metadataFolder, importPath);
	if ((await exists(resolve(absoluteImportPath, 'plugins.json'))) || (await exists(resolve(absoluteImportPath, 'templates.json')))) return;
	await untap(importPath);
	throw new Error(`This repository doesn't contain the required configs`);
}

export async function getTapsAbsolutePaths(): Promise<string[]> {
	const taps = await getTaps();
	const tapsAbsolutePaths = [];
	for (const tap of taps) tapsAbsolutePaths.push(resolve(metadataFolder, tap));
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
