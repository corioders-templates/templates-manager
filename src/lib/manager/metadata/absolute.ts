import { resolve } from 'path';

import { exists } from '@/nodekit/fs';

import { getTapsAbsolutePaths } from './tap';

async function getConfigAbsolutePaths(configName: string): Promise<string[]> {
	const tapsAbsolutePaths = await getTapsAbsolutePaths();
	const configPaths = [];
	let configAbsolutePath = '';
	for (const tapPath of tapsAbsolutePaths) {
		configAbsolutePath = resolve(tapPath, `${configName}.json`);
		if (!(await exists(configAbsolutePath))) continue;
		configPaths.push(configAbsolutePath);
	}
	return configPaths;
}

export async function getPluginsAbsolutePaths(): Promise<string[]> {
	return await getConfigAbsolutePaths('plugins');
}

export async function getTemplatesAbsolutePaths(): Promise<string[]> {
	return await getConfigAbsolutePaths('templates');
}
