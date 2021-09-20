import { resolve } from 'path';

import { importPathToAbsolute } from './importPath';
import { tap, untap, getTaps } from './tap';

/**
 * ModulesManager manages tapable modules that you can find on git remote platforms like github
 */
export class ModuleManager {
	constructor(moduleFolder: string) {
		this.initPaths(moduleFolder);
	}

	private moduleFolderPath: string;
	private tapFilePath: string;
	private downloadFolderPath: string;
	private initPaths(moduleFolder: string): void {
		this.moduleFolderPath = moduleFolder;
		this.tapFilePath = resolve(moduleFolder, 'tap.json');
		this.downloadFolderPath = resolve(moduleFolder, 'download');
	}

	async importPathToAbsolute(importPath: string): Promise<string> {
		return await importPathToAbsolute(importPath, this.downloadFolderPath);
	}
	async tap(importPath: string): Promise<void> {
		await tap(importPath, this.downloadFolderPath, this.tapFilePath);
	}
	async untap(importPath: string): Promise<void> {
		await untap(importPath, this.downloadFolderPath, this.tapFilePath);
	}
	async getTap(): Promise<string[]> {
		return await getTaps(this.tapFilePath);
	}
}
