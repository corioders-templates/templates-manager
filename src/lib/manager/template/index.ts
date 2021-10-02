import { ModuleManager } from '@/lib/manager/module';
import { ProgramManager } from '@/lib/manager/program';

import { importPathToTemplate, Template } from './template';

export class TemplateManager {
	private programManager: ProgramManager;
	private moduleManager: ModuleManager;

	constructor(programManager: ProgramManager, moduleManager: ModuleManager) {
		this.initPaths();
		this.programManager = programManager;
		this.moduleManager = moduleManager;
	}

	private initPaths(): void {}

	importPathToTemplate(importPath: string): Promise<Template> {
		return importPathToTemplate(importPath, this.programManager, this.moduleManager);
	}
}
