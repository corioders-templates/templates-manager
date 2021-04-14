import { resolve } from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

import { metadata } from '@/lib/constant/path/metadata';

import { rmdir } from 'fs/promises';

export async function tap(url: string): Promise<void> {
	const git: SimpleGit = simpleGit();
	await git.clone(url, resolve(metadata, url.split('//')[1]));
}

export async function untap(url: string): Promise<void> {
	await rmdir(resolve(metadata, url.split('//')[1]), { recursive: true });
}

export function getTaps(): string[] {
	return [];
}
