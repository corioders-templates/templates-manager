import { ModulesManager } from '@/lib/manager/modules';
import { ProgramManager } from '@/lib/manager/program';

import { importPathToTemplate, Template } from './template';

export class TemplatesManager {
	private programManager: ProgramManager;
	private modulesManager: ModulesManager;

	constructor(programManager: ProgramManager, modulesManager: ModulesManager) {
		this.initPaths();
		this.programManager = programManager;
		this.modulesManager = modulesManager;
	}

	private initPaths(): void {}

	importPathToTemplate(importPath: string): Promise<Template> {
		return importPathToTemplate(importPath, this.programManager, this.modulesManager)
	}
}
