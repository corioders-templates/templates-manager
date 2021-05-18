import { resolve } from 'path';

import { exists } from '@/nodekit/fs';

import { getTapsAbsolutePaths } from './tap';

async function getConfigAbsolutePaths(configName: string, modulesFolderPath: string, tapsFilePath: string): Promise<string[]> {
	const tapsAbsolutePaths = await getTapsAbsolutePaths(modulesFolderPath, tapsFilePath);
	const configPaths = [];
	let configAbsolutePath = '';
	for (const tapPath of tapsAbsolutePaths) {
		configAbsolutePath = resolve(tapPath, `${configName}.json`);
		if (!(await exists(configAbsolutePath))) continue;
		configPaths.push(configAbsolutePath);
	}
	return configPaths;
}

export async function getPluginsAbsolutePaths(modulesFolderPath: string, tapsFilePath: string): Promise<string[]> {
	return await getConfigAbsolutePaths('plugins', modulesFolderPath, tapsFilePath);
}

export async function getTemplatesAbsolutePaths(modulesFolderPath: string, tapsFilePath: string): Promise<string[]> {
	return await getConfigAbsolutePaths('templates', modulesFolderPath, tapsFilePath);
}
