import { ModulesManager } from '@/lib/manager/modules';
import { ProgramManager } from '@/lib/manager/program';
import { Global } from '@/plugins/global';

import { execute } from './execute';
import { importPathToPlugin, Plugin, RealPlugin, RealPluginConstructor } from './plugins';

export class PluginsManager {
	private programManager: ProgramManager;
	private modulesManager: ModulesManager;
	constructor(pluginsDataFolder: string, programManager: ProgramManager, modulesManager: ModulesManager) {
		this.initPaths(pluginsDataFolder);
		this.programManager = programManager;
		this.modulesManager = modulesManager;
	}
	private pluginsDataFolder: string;
	private initPaths(pluginsDataFolder: string): void {
		this.pluginsDataFolder = pluginsDataFolder;
	}

	execute(plugins: Plugin[], global: Global = new Global()): Global {
		return execute(plugins, global, this.pluginsDataFolder);
	}
	importPathToPlugin(importPath: string): Promise<RealPluginConstructor> {
		return importPathToPlugin(importPath, this.programManager, this.modulesManager);
	}
}

export { Plugin, RealPlugin };
