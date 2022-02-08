import { MetadataManager } from '@/lib/manager/metadata';
import { ModuleManager } from '@/lib/manager/module';
import { ProgramManager } from '@/lib/manager/program';

import { importPathToTemplate, Template } from './template';

export class TemplateManager {
	private programManager: ProgramManager;
	private moduleManager: ModuleManager;
	private metadataManager: MetadataManager;

	constructor(programManager: ProgramManager, moduleManager: ModuleManager, metadataManager: MetadataManager) {
		this.initPaths();
		this.programManager = programManager;
		this.moduleManager = moduleManager;
		this.metadataManager = metadataManager;
	}

	private initPaths(): void {}

	importPathToTemplate(importPath: string): Promise<Template> {
		return importPathToTemplate(importPath, this.programManager, this.moduleManager, this.metadataManager);
	}
}
