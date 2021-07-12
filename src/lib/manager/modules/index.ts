import { resolve } from 'path';

import { getPluginsAbsolutePaths, getTemplatesAbsolutePaths } from './absolute';
import { importPathToAbsolute } from './importPath';
import { tap, untap, getTaps } from './tap';
import { update } from './update';

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

	async getPluginsAbsolutePaths(): Promise<string[]> {
		return await getPluginsAbsolutePaths(this.downloadsFolderPath, this.tapsFilePath);
	}
	async getTemplatesAbsolutePaths(): Promise<string[]> {
		return await getTemplatesAbsolutePaths(this.downloadsFolderPath, this.tapsFilePath);
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

	async update(): Promise<void> {
		await update(this.downloadsFolderPath, this.tapsFilePath);
	}
}
