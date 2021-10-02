import { ModuleManager } from '@/lib/manager/module';
import { ProgramManager } from '@/lib/manager/program';
import { GlobalPluginObject } from '@/plugin/global';

import { execute } from './execute';
import { importPathToPlugin, Plugin, RealPlugin, RealPluginConstructor } from './plugin';

export class PluginManager {
	private programManager: ProgramManager;
	private moduleManager: ModuleManager;
	readonly globalPluginObject: GlobalPluginObject;

	constructor(pluginDataFolder: string, programManager: ProgramManager, moduleManager: ModuleManager) {
		this.initPaths(pluginDataFolder);
		this.programManager = programManager;
		this.moduleManager = moduleManager;
		this.globalPluginObject = new GlobalPluginObject();
	}

	private pluginDataFolder: string;
	private initPaths(pluginsDataFolder: string): void {
		this.pluginDataFolder = pluginsDataFolder;
	}

	execute(plugins: Plugin[]): void {
		execute(plugins, this.pluginDataFolder, this.globalPluginObject);
	}

	importPathToPlugin(importPath: string): Promise<RealPluginConstructor> {
		return importPathToPlugin(importPath, this.programManager, this.moduleManager);
	}
}

export { Plugin, RealPlugin };
