import { Global } from '@/plugins/global';

import { execute } from './execute';
import { Plugin, RealPlugin } from './plugins';

export class PluginsManager {
	constructor(pluginsDataFolder: string) {
		this.initPaths(pluginsDataFolder);
	}
	private pluginsDataFolder: string;
	private initPaths(pluginsDataFolder: string): void {
		this.pluginsDataFolder = pluginsDataFolder;
	}

	execute(plugins: Plugin[], global: Global = new Global()): Global {
		return execute(plugins, global, this.pluginsDataFolder);
	}
}

export { Plugin, RealPlugin };
