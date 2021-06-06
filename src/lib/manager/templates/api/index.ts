import { Folder } from '@/nodekit/fs/file';
import { Global } from '@/plugins/global';

export interface TemplatesApi {
	// pluginsGlobal is an easy way to access all plugged stuff.
	pluginsGlobal: Global;

	// `template` directory.
	folder: Folder;

	//! fences needs to be created as safety for api functions that return promise: if template_func returns before async api function then template_func hadn't awaited for api.
	// applyStripBlocks evaluates strip blocks conditions based on stripBlocksGlobalObject, and removes or leaves them based on the evaluation.
	applyStripBlocks(stripBlocksGlobalObject: Record<string, unknown>, folder?: Folder): Promise<void>;
}

// after template_func returns files are written into final part destination.
async function template_func(api: TemplatesApi): Promise<void> {
	// api.files are populated, but shouldn't be accessed directly.

	// Strip blocks parameters.
	const use_ts = true;
	const use_pinia = true;
	const use_scriptSetup = true;

	await api.applyStripBlocks({
		use_pinia,
		use_ts,
		use_scriptSetup,
	});
}
