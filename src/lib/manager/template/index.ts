import { MetadataManager } from '@/lib/manager/metadata';
import { ModuleManager } from '@/lib/manager/module';
import { PluginManager } from '@/lib/manager/plugin';
import { ProgramManager } from '@/lib/manager/program';

import { importPathToTemplate, updateTemplate, Template } from './template';

export class TemplateManager {
	private programManager: ProgramManager;
	private pluginManager: PluginManager;
	private moduleManager: ModuleManager;
	private metadataManager: MetadataManager;

	constructor(programManager: ProgramManager, moduleManager: ModuleManager, pluginManager: PluginManager, metadataManager: MetadataManager) {
		this.pluginManager = pluginManager;
		this.programManager = programManager;
		this.moduleManager = moduleManager;
		this.metadataManager = metadataManager;
	}

	importPathToTemplate(importPath: string): Promise<Template> {
		return importPathToTemplate(importPath, this.programManager, this.moduleManager, this.metadataManager);
	}

	updateTemplate(fileFolderPath: string): Promise<void> {
		return updateTemplate(fileFolderPath, this, this.moduleManager, this.pluginManager, this.metadataManager);
	}
}
