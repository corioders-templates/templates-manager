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

	async tap(importPath: string): Promise<void> {
		await tap(importPath, this.modulesFolderPath, this.tapsFilePath);
	}
	async untap(importPath: string): Promise<void> {
		await untap(importPath, this.modulesFolderPath, this.tapsFilePath);
	}
	getTaps() {}

	getPluginsAbsolutePaths() {}
	getTemplatesAbsolutePaths() {}
}
