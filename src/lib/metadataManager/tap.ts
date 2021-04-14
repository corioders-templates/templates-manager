import { resolve } from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

import { metadata } from '@/lib/constant/path/metadata';

export async function tap(url: string): Promise<void> {
	const git: SimpleGit = simpleGit();
	await git.clone(url, resolve(metadata, url.split('//')[1]));
}

export function untap(url: string): void {}

export function getTaps(): string[] {
	return [];
}
