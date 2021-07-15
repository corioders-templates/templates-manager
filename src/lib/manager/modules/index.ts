import { resolve } from 'path';

import { getPluginsJsonAbsolutePaths, getTemplatesJsonAbsolutePaths } from './absolute';
import { importPathToAbsolute } from './importPath';
import { tap, untap, getTaps } from './tap';

/**
 * ModulesManager manages tapable modules that you can find on git remote platforms like github
 */
export class ModulesManager {
	constructor(modulesFolder: string) {
		this.initPaths(modulesFolder);
	}

	private modulesFolderPath: string;
	private tapsFilePath: string;
	private downloadsFolderPath: string;
	private initPaths(modulesFolder: string): void {
		this.modulesFolderPath = modulesFolder;
		this.tapsFilePath = resolve(modulesFolder, 'taps.json');
		this.downloadsFolderPath = resolve(modulesFolder, 'downloads');
	}

	async getPluginsJsonAbsolutePaths(): Promise<string[]> {
		return await getPluginsJsonAbsolutePaths(this.downloadsFolderPath, this.tapsFilePath);
	}
	async getTemplatesJsonAbsolutePaths(): Promise<string[]> {
		return await getTemplatesJsonAbsolutePaths(this.downloadsFolderPath, this.tapsFilePath);
	}

	async importPathToAbsolute(importPath: string): Promise<string> {
		return await importPathToAbsolute(importPath, this.downloadsFolderPath);
	}

	async tap(importPath: string): Promise<void> {
		await tap(importPath, this.downloadsFolderPath, this.tapsFilePath);
	}
	async untap(importPath: string): Promise<void> {
		await untap(importPath, this.downloadsFolderPath, this.tapsFilePath);
	}
	async getTaps(): Promise<string[]> {
		return await getTaps(this.tapsFilePath);
	}
}
