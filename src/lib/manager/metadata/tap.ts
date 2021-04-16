import { resolve, join } from 'path';
import simpleGit from 'simple-git';

import { metadata, tapsFile } from '@/lib/constant/location/metadata';
import { exists } from '@/nodekit/fs';

import { checkUrl } from './validate';

import { rmdir, lstat, readdir, readFile, writeFile } from 'fs/promises';

export async function tap(url: string): Promise<void> {
	checkUrl(url);
	const git = simpleGit();
	await git.clone(`https://${url}`, resolve(metadata, url));
	const taps = await getTaps();
	taps.push(url);
	await writeTaps(taps);
}

export async function untap(url: string): Promise<void> {
	checkUrl(url);
	await rmdir(resolve(metadata, url), { recursive: true });
	await removeEmptyDirectories(metadata);
	const taps = await getTaps();
	const tap = taps.indexOf(url);
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

export async function getTapsAbsolutePaths(): Promise<string[]> {
	const taps = await getTaps();
	const tapsAbsolutePaths = [];
	for (const tap of taps) tapsAbsolutePaths.push(resolve(metadata, tap));
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
