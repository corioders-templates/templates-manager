import { FsJsonStorage } from '@corioders/nodekit/storage/impl';
import base64url from 'base64url';
import { resolve } from 'path';

import { GlobalPluginObject } from '@/plugin/global';

import { Plugin } from './plugin';

export function execute(plugins: Plugin[], pluginDataFolder: string, globalPluginsObject: GlobalPluginObject): void {
	for (const plugin of plugins) {
		executePlugin(plugin, pluginDataFolder, globalPluginsObject);
	}
}

const usedPluginsNames = new Set<string>();
/**
 * executePlugin executes single plugin, it validates if plugin is valid Plugin interface.
 * Additionally this function keeps track of received plugins names, and throws error when names are not unique.
 */
function executePlugin(plugin: Plugin, pluginDataFolder: string, globalPluginObject: GlobalPluginObject): void {
	if (plugin.name === undefined) throw new Error(`plugins manager error: missing require property: plugin.name, for plugin ${plugin}`);
	if (plugin.execute === undefined) throw new Error(`plugins manager error: missing require property: plugin.execute, for plugin ${plugin.name}`);
	if (usedPluginsNames.has(plugin.name)) throw new Error(`plugins manager error: plugin name not unique: ${plugin.name}`);
	usedPluginsNames.add(plugin.name);

	plugin.execute(new FsJsonStorage(getStorageFolder(plugin, pluginDataFolder)), globalPluginObject);
}

function getStorageFolder(plugin: Plugin, pluginDataFolder: string): string {
	// Encode plugin's name to base64 so we don't have to deal with illegal folder characters.
	const nameBase64 = base64url(plugin.name);
	const dataFolder = resolve(pluginDataFolder, nameBase64);
	return dataFolder;
}
