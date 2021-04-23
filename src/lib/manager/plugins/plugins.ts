import { importPathToAbsolute } from '@/lib/manager/modules';
import { buildProgram, getProgramEntry } from '@/lib/manager/program/build';
import { Global } from '@/plugins/global';

export abstract class Plugin {
	/**
	 * Name must be unique across all plugins.
	 * Note that changing name changes dataFolder.
	 */
	abstract name: string;

	/**
	 * execute is called when plugin is executed
	 */
	abstract execute(dataFolder: string, global: Global): void;
}

/**
 * importPathToPlugin creates plugin instance from importPath, it assumes that importPath is valid plugin import path.
 */
export async function importPathToPlugin(importPath: string): Promise<typeof Plugin> {
	const absolutePluginPath = await importPathToAbsolute(importPath);
	await buildProgram(importPath, absolutePluginPath);
	const module = (await import(getProgramEntry(absolutePluginPath))) as { default: typeof Plugin };
	return module.default;
}
