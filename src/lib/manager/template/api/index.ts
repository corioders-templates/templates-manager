import { Folder } from '@corioders/nodekit/fs/file';

import { GlobalPluginsObject } from '@/plugin/global';

import applyStripBlocks from './stripBlock';

export interface templateApi {
	// `template` directory.
	folder: Folder;

	// pluginsGlobal is an easy way to access all plugged stuff.
	pluginsGlobal: GlobalPluginsObject;

	//! fences needs to be created as safety for api functions that return promise: if template_func returns before async api function then template_func hadn't awaited for api.
	// applyStripBlocks evaluates strip blocks conditions based on stripBlocksGlobalObject, and removes or leaves them based on the evaluation.
	applyStripBlocks(stripBlockGlobalObject: Record<string, unknown>, folder?: Folder): Promise<void>;
}

export class TemplateApi implements templateApi {
	folder: Folder;
	pluginsGlobal: GlobalPluginsObject;

	constructor(folder: Folder, pluginGlobal: GlobalPluginsObject) {
		this.folder = folder;
		this.pluginsGlobal = pluginGlobal;
	}

	// TODO: @watjurk optimize this
	async applyStripBlocks(stripBlockGlobalObject: Record<string, unknown>, folder?: Folder): Promise<void> {
		folder ||= this.folder;
		await applyStripBlocks(stripBlockGlobalObject, folder.getAllFiles());
	}
}
