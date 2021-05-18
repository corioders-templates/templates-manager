import { resolve } from 'path';

import { getPluginsAbsolutePaths, getTemplatesAbsolutePaths } from './absolute';
import { importPathToAbsolute } from './importPath';
import { tap, untap, getTaps } from './tap';
import { update } from './update';

export class Modules {
	constructor(modulesFolder: string) {
		this.initPaths(modulesFolder);
	}

	private modulesFolderPath: string;
	private tapsFilePath: string;
	private initPaths(modulesFolder: string): void {
		this.modulesFolderPath = modulesFolder;
		this.tapsFilePath = resolve(modulesFolder, 'taps.json');
	}

	async getPluginsAbsolutePaths(): Promise<string[]> {
		return await getPluginsAbsolutePaths(this.modulesFolderPath, this.tapsFilePath);
	}
	async getTemplatesAbsolutePaths(): Promise<string[]> {
		return await getTemplatesAbsolutePaths(this.modulesFolderPath, this.tapsFilePath);
	}

	async importPathToAbsolute(importPath: string): Promise<string> {
		return await importPathToAbsolute(importPath, this.modulesFolderPath);
	}

	async tap(importPath: string): Promise<void> {
		await tap(importPath, this.modulesFolderPath, this.tapsFilePath);
	}
	async untap(importPath: string): Promise<void> {
		await untap(importPath, this.modulesFolderPath, this.tapsFilePath);
	}
	async getTaps(): Promise<string[]> {
		return await getTaps(this.tapsFilePath);
	}

	async update(): Promise<void> {
		await update(this.modulesFolderPath, this.tapsFilePath);
	}
}
