import { Folder } from '@corioders/nodekit/fs/file';

import { GlobalPluginsObject } from '@/plugin/global';

import applyStripBlock from './stripBlock';

export interface templateApi {
	// `template` directory.
	folder: Folder;

	// pluginsGlobal is an easy way to access all plugged stuff.
	pluginGlobal: GlobalPluginsObject;

	//! fences needs to be created as safety for api functions that return promise: if template_func returns before async api function then template_func hadn't awaited for api.
	// applyStripBlocks evaluates strip blocks conditions based on stripBlocksGlobalObject, and removes or leaves them based on the evaluation.
	applyStripBlock(stripBlockGlobalObject: Record<string, unknown>, folder?: Folder): Promise<void>;
}

export class TemplateApi implements templateApi {
	folder: Folder;
	pluginGlobal: GlobalPluginsObject;

	constructor(folder: Folder, pluginGlobal: GlobalPluginsObject) {
		this.folder = folder;
		this.pluginGlobal = pluginGlobal;
	}

	// TODO: @watjurk optimize this
	async applyStripBlock(stripBlockGlobalObject: Record<string, unknown>, folder?: Folder): Promise<void> {
		folder ||= this.folder;
		await applyStripBlock(stripBlockGlobalObject, folder.getAllFiles());
	}
}
