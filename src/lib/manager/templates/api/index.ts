import { Folder } from '@corioders/nodekit/fs/file';

import { Global } from '@/plugins/global';

import applyStripBlocks from './stripBlocks';

export interface templatesApi {
	// `template` directory.
	folder: Folder;

	// pluginsGlobal is an easy way to access all plugged stuff.
	pluginsGlobal: Global;

	//! fences needs to be created as safety for api functions that return promise: if template_func returns before async api function then template_func hadn't awaited for api.
	// applyStripBlocks evaluates strip blocks conditions based on stripBlocksGlobalObject, and removes or leaves them based on the evaluation.
	applyStripBlocks(stripBlocksGlobalObject: Record<string, unknown>, folder?: Folder): Promise<void>;
}

export class TemplatesApi implements templatesApi {
	folder: Folder;
	pluginsGlobal: Global;

	constructor(folder: Folder, pluginsGlobal: Global) {
		this.folder = folder;
		this.pluginsGlobal = pluginsGlobal;
	}

	// TODO: @watjurk optimize this
	async applyStripBlocks(stripBlocksGlobalObject: Record<string, unknown>, folder?: Folder): Promise<void> {
		folder ||= this.folder;
		await applyStripBlocks(stripBlocksGlobalObject, folder.getAllFiles());
	}
}
