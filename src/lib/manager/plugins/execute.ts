import base64url from 'base64url';
import { resolve } from 'path';

import { pluginsDataFolder } from '@/lib/constant/location/plugins';
import { FsJsonStorage } from '@/nodekit/storage/impl';
import { Global } from '@/plugins/global';

import { Plugin } from './plugins';

export function execute(plugins: Plugin[], global: Global = new Global()): Global {
	for (const plugin of plugins) {
		executePlugin(plugin, global);
	}
	return global;
}

const pluginsNames = new Set<string>();
/**
 * executePlugin executes single plugin, it validates if plugin is valid Plugin interface.
 * Additionally this function keeps track of received plugins names, and throws error when names are not unique.
 */
function executePlugin(plugin: Plugin, global: Global): void {
	if (plugin.name === undefined) throw new Error(`plugins manager error: missing require property: plugin.name, for plugin ${plugin}`);
	if (plugin.execute === undefined) throw new Error(`plugins manager error: missing require property: plugin.execute, for plugin ${plugin.name}`);
	if (pluginsNames.has(plugin.name)) throw new Error(`plugins manager error: plugin name not unique: ${plugin.name}`);
	pluginsNames.add(plugin.name);

	plugin.execute(new FsJsonStorage(getStorageFolder(plugin)), global);
}

function getStorageFolder(plugin: Plugin): string {
	// Encode plugin's name to base64 so we don't have to deal with illegal folder characters.
	const nameBase64 = base64url(plugin.name);
	const dataFolder = resolve(pluginsDataFolder, nameBase64);
	return dataFolder;
}
