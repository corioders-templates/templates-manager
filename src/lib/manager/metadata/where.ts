import { resolve } from 'path';

import { metadata } from '@/lib/constant/location/metadata';

import { downloader } from './downloader';
import { checkUrl } from './validate';

export async function whereToAbsolutePath(where: string): Promise<string> {
	checkUrl(where);
	const absoluteWhere = resolve(metadata, where);
	await downloader(where, absoluteWhere);
	return absoluteWhere;
}
