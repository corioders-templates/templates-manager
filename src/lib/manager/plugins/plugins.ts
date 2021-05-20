import { defaultModulesManager, defaultProgramManager } from '@/lib/manager';
import { Storage } from '@/nodekit/storage';
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
	abstract execute(storage: Storage, global: Global): void;
}

/**
 * importPathToPlugin creates plugin instance from importPath, it assumes that importPath is valid plugin import path.
 */
export async function importPathToPlugin(importPath: string): Promise<RealPluginConstructor> {
	const absolutePluginPath = await defaultModulesManager.importPathToAbsolute(importPath);
	await defaultProgramManager.buildProgram(importPath, absolutePluginPath);
	const module = (await import(defaultProgramManager.getProgramEntry(absolutePluginPath))) as { default?: unknown };
	const plugin = module.default;
	if (plugin === undefined) throw new Error('Plugin entry point must have a default export');
	if (!isRealPluginConstructor(plugin)) throw new Error('Plugin entry point must export default class that implements Plugin class');
	return plugin;
}

/**
 * This is how normal plugin should look like, of course normal plugin won't have noop execute nad constructor.
 * This is only placeholder class and shouldn't be used directly.
 */
export class RealPlugin implements Plugin {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	constructor(...args: unknown[]) {}
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	execute(storage: Storage, global: Global): void {}
}
type RealPluginConstructor = typeof RealPlugin;

function isRealPluginConstructor(x: unknown): x is RealPluginConstructor {
	if (typeof x !== 'function') return false;

	const y = x as { prototype: unknown };
	const z = y.prototype;

	// We cannot check for name as it's only available after calling constructor.
	if (!Object.prototype.hasOwnProperty.call(z, 'execute')) return false;

	const a = z as { execute: unknown };
	if (typeof a['execute'] !== 'function') return false;

	// eslint-disable-next-line @typescript-eslint/ban-types
	const b = a as { name: string; execute: Function };
	if (b.execute.length != 2) return false;

	return true;
}
