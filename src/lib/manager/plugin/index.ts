import { ModuleManager } from '@/lib/manager/module';
import { ProgramManager } from '@/lib/manager/program';

import { execute } from './execute';
import { importPathToPlugin, Plugin, RealPlugin, RealPluginConstructor } from './plugin';

export class PluginManager {
	private programManager: ProgramManager;
	private moduleManager: ModuleManager;
	constructor(pluginDataFolder: string, programManager: ProgramManager, moduleManager: ModuleManager) {
		this.initPaths(pluginDataFolder);
		this.programManager = programManager;
		this.moduleManager = moduleManager;
	}
	private pluginDataFolder: string;
	private initPaths(pluginsDataFolder: string): void {
		this.pluginDataFolder = pluginsDataFolder;
	}

	execute(plugins: Plugin[]): void {
		execute(plugins, this.pluginDataFolder);
	}
	importPathToPlugin(importPath: string): Promise<RealPluginConstructor> {
		return importPathToPlugin(importPath, this.programManager, this.moduleManager);
	}
}

export { Plugin, RealPlugin };
