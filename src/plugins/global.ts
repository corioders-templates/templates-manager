import { AsyncSeriesHook } from 'tapable';

import * as gitRemote from './git-remote-provider';

export interface GlobalPluginsObject {
	'git-remote-provider': gitRemote.Provider;
	hooks: GlobalHooks;
}

class GlobalClass implements GlobalPluginsObject {
	'git-remote-provider': gitRemote.Provider;
	hooks: GlobalHooks;

	constructor() {
		this['git-remote-provider'] = new gitRemote.NoopProvider();
		this.hooks = new GlobalHooks();
	}
}

class GlobalHooks {
	init = new AsyncSeriesHook<[]>();
}

export const globalPluginsObject = new GlobalClass();
