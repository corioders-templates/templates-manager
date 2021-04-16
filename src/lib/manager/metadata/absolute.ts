import { resolve } from 'path';

import { exists } from '@/nodekit/fs';

import { getTapsAbsolutePaths } from './tap';

async function getJsonAbsolutePaths(name: string): Promise<string[]> {
	const tapsAbsolutePaths = await getTapsAbsolutePaths();
	const jsonPaths = [];
	let jsonAbsolutePath = '';
	for (const tapPath of tapsAbsolutePaths) {
		jsonAbsolutePath = resolve(tapPath, `${name}.json`);
		if (!(await exists(jsonAbsolutePath))) continue;
		jsonPaths.push(jsonAbsolutePath);
	}
	return jsonPaths;
}

export async function getPluginsAbsolutePaths(): Promise<string[]> {
	return await getJsonAbsolutePaths('plugins');
}

export async function getTemplatesAbsolutePaths(): Promise<string[]> {
	return await getJsonAbsolutePaths('templates');
}
