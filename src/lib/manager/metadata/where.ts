import { resolve } from 'path';
import simpleGit from 'simple-git';

import { metadata } from '@/lib/constant/location/metadata';
import { exists } from '@/nodekit/fs';

import { checkUrl } from './validate';

export async function whereToAbsolutePath(where: string): Promise<string> {
	checkUrl(where);
	const absoluteWhere = resolve(metadata, where);
	await downloader(where, absoluteWhere);
	return absoluteWhere;
}

async function downloader(where: string, absoluteWhere: string): Promise<void> {
	if (await exists(absoluteWhere)) {
		await simpleGit(absoluteWhere).pull('origin', 'master');
		return;
	}
	await simpleGit().clone(`https://${where}`, absoluteWhere);
}
