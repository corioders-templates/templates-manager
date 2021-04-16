import { Global } from '@/plugins/global';

export interface Plugin {
	/**
	 * name must be unique across all plugins.
	 * Note that changing name changes dataFolder
	 */
	name: string;

	/**
	 * execute is called when plugin is executed
	 */
	execute(dataFolder: string, global: Global): void;
}

export function importPathToPlugin(importPath: string): Plugin {
	return {} as Plugin;
}
