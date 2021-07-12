import { Folder } from '@corioders/nodekit/fs/file';

import { ModulesManager } from '@/lib/manager/modules';
import { ProgramManager } from '@/lib/manager/program';

export class TemplatesManager {
	private programManager: ProgramManager;
	private modulesManager: ModulesManager;

	constructor(programManager: ProgramManager, modulesManager: ModulesManager) {
		this.initPaths();
		this.programManager = programManager;
		this.modulesManager = modulesManager;
	}

	private initPaths(): void {}

	importPathToPart(importPath: string): Promise<Folder> {
		// return importPathToTemplate(importPath, this.programManager, this.modulesManager);
		return new Promise(() => {});
	}
}
