import { resolve, join } from 'path';
import simpleGit from 'simple-git';

import { metadata } from '@/lib/constant/location/metadata';
import { exists } from '@/nodekit/fs';

import { checkUrl } from './validate';

import { rmdir, lstat, readdir } from 'fs/promises';

export async function tap(url: string): Promise<void> {
	checkUrl(url);
	const git = simpleGit();
	await git.clone(url);
}

export async function untap(url: string): Promise<void> {
	checkUrl(url);
	await rmdir(resolve(metadata, url), { recursive: true });
	await removeEmptyDirectories(metadata);
}

export async function getTaps(): Promise<string[]> {
	const taps = [];
	if (await exists(metadata)) {
		const providers = await readdir(metadata);
		for (const i in providers) {
			const users = await readdir(resolve(metadata, providers[i]));
			for (const j in users) {
				const names = await readdir(resolve(metadata, providers[i], users[j]));
				for (const k in names) taps.push(join(providers[i], users[j], names[k]));
			}
		}
	}
	return taps;
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
