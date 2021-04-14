import { resolve, join } from 'path';
import simpleGit from 'simple-git';

import { metadata } from '@/lib/constant/location/metadata';

import { rmdir, lstat, readdir } from 'fs/promises';

export async function tap(url: string): Promise<void> {
	const git = simpleGit();
	await git.clone(url, resolve(metadata, url.split('//')[1]));
}

export async function untap(url: string): Promise<void> {
	await rmdir(resolve(metadata, url.split('//')[1]), { recursive: true });
	await removeEmptyDirectories(metadata);
}

export function getTaps(): string[] {
	return [];
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
