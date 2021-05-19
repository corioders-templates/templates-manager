import { resolve } from 'path';

import { exists } from '@/nodekit/fs';

import { getTapsAbsolutePaths } from './tap';

async function getConfigAbsolutePaths(configName: string, downloadsFolderPath: string, tapsFilePath: string): Promise<string[]> {
	const tapsAbsolutePaths = await getTapsAbsolutePaths(downloadsFolderPath, tapsFilePath);
	const configPaths = [];
	let configAbsolutePath = '';
	for (const tapPath of tapsAbsolutePaths) {
		configAbsolutePath = resolve(tapPath, `${configName}.json`);
		if (!(await exists(configAbsolutePath))) continue;
		configPaths.push(configAbsolutePath);
	}
	return configPaths;
}

export async function getPluginsAbsolutePaths(downloadsFolderPath: string, tapsFilePath: string): Promise<string[]> {
	return await getConfigAbsolutePaths('plugins', downloadsFolderPath, tapsFilePath);
}

export async function getTemplatesAbsolutePaths(downloadsFolderPath: string, tapsFilePath: string): Promise<string[]> {
	return await getConfigAbsolutePaths('templates', downloadsFolderPath, tapsFilePath);
}
