import { Global } from '@/plugins/global';

// Ultimately File class will be in nodekit/fs, file also could represent folder.
interface File {}

// Ultimately Files will be in lib/manager/templates.
// Files provide some helper functions to manipulate lots of flies eg: get list of files by name, get files from folder etc.
interface Files {
	files: File[];
}

export interface TemplatesApi {
	// pluginsGlobal is an easy way to access all plugged stuff.
	pluginsGlobal: Global;

	// files are all files read from `template` directory.
	files: Files;

	//! fences needs to be created as safety for api functions that return promise: if template_func returns before async api function then template_func hadn't awaited for api.
	// applyStripBlocks evaluates strip blocks conditions based on stripBlocksGlobalObject, and removes or leaves them based on the evaluation.
	applyStripBlocks(stripBlocksGlobalObject: Record<string, unknown>, files?: Files): Promise<void>;
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
