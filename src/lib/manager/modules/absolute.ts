import { exists } from '@corioders/nodekit/fs';
import { resolve } from 'path';

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

/**
 * getPluginsJsonAbsolutePaths returns array of absolute paths to plugins.json files found in taps
 */
export async function getPluginsJsonAbsolutePaths(downloadsFolderPath: string, tapsFilePath: string): Promise<string[]> {
	return await getConfigAbsolutePaths('plugins', downloadsFolderPath, tapsFilePath);
}

/**
 * getTemplatesJsonAbsolutePaths returns array of absolute paths to templates.json files found in taps
 */
export async function getTemplatesJsonAbsolutePaths(downloadsFolderPath: string, tapsFilePath: string): Promise<string[]> {
	return await getConfigAbsolutePaths('templates', downloadsFolderPath, tapsFilePath);
}
