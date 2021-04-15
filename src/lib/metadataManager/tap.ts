import { resolve, join } from 'path';
import simpleGit from 'simple-git';

import { metadata } from '@/lib/constant/location/metadata';

import { rmdir, lstat, readdir } from 'fs/promises';

export async function tap(url: string): Promise<void> {
	const git = simpleGit();
	await git.clone(url, parseUrl(url));
}

export async function untap(url: string): Promise<void> {
	await rmdir(resolve(metadata, parseUrl(url)), { recursive: true });
	await removeEmptyDirectories(metadata);
}

export function getTaps(): string[] {
	return [];
}

function parseUrl(url: string): string {
	return resolve(metadata, url.split('//')[1]);
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
