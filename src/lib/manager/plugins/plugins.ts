import { Storage } from '@corioders/nodekit/storage';

import { ModulesManager } from '@/lib/manager/modules';
import { ProgramManager } from '@/lib/manager/program';
import { GlobalPluginsObject } from '@/plugins/global';

export abstract class Plugin {
	/**
	 * Name must be unique across all plugins.
	 * Note that changing name also changes dataFolder.
	 */
	abstract name: string;

	/**
	 * execute is called when plugin is executed.
	 */
	abstract execute(storage: Storage, global: GlobalPluginsObject): void;
}

/**
 * importPathToPlugin returns plugin constructor from importPath, it assumes that importPath is valid plugin import path.
 */
export async function importPathToPlugin(importPath: string, programManager: ProgramManager, modulesManager: ModulesManager): Promise<RealPluginConstructor> {
	const absolutePluginPath = await modulesManager.importPathToAbsolute(importPath);
	await programManager.buildProgram(importPath, absolutePluginPath);
	const module = (await import(programManager.getProgramEntry(absolutePluginPath))) as { default?: unknown };
	const plugin = module.default;
	if (plugin === undefined) throw new Error('Plugin entry point must have a default export');
	if (!isRealPluginConstructor(plugin)) throw new Error('Plugin entry point must export default class that implements Plugin class');
	return plugin;
}

/**
 * This is how normal plugin should look like, of course normal plugin won't have noop execute and constructor.
 * This is only placeholder class and shouldn't be used directly.
 */
export class RealPlugin implements Plugin {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	constructor(...args: unknown[]) {}
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	execute(storage: Storage, global: GlobalPluginsObject): void {}
}
export type RealPluginConstructor = typeof RealPlugin;

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
