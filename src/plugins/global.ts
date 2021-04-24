import { AsyncSeriesHook } from 'tapable';

import * as gitRemote from './git-remote-provider';

export class Global {
	'git-remote-provider': gitRemote.Provider;
	hooks: GlobalHooks;

	constructor() {
		this.hooks = new GlobalHooks();
		this['git-remote-provider'] = new gitRemote.NoopProvider();
	}
}

export class GlobalHooks {
	init = new AsyncSeriesHook<[]>();
}
