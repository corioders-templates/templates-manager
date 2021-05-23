import { ModulesManager } from '@/lib/manager/modules';
import { ProgramManager } from '@/lib/manager/program';
import { Global } from '@/plugins/global';

import { execute } from './execute';
import { Plugin, RealPlugin } from './plugins';

export class PluginsManager {
	constructor(pluginsDataFolder: string, ProgramManager: ProgramManager, ModulesManager: ModulesManager) {
		this.initPaths(pluginsDataFolder);
		this.ProgramManager = ProgramManager;
		this.ModulesManager = ModulesManager;
	}
	private pluginsDataFolder: string;
	private initPaths(pluginsDataFolder: string): void {
		this.pluginsDataFolder = pluginsDataFolder;
	}
	private ProgramManager: ProgramManager;
	private ModulesManager: ModulesManager;

	execute(plugins: Plugin[], global: Global = new Global()): Global {
		return execute(plugins, global, this.pluginsDataFolder);
	}
}

export { Plugin, RealPlugin };
