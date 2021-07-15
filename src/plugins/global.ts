import { AsyncSeriesHook } from 'tapable';

import * as cli from './cli-api';
import * as gitRemote from './git-remote-provider';

export class GlobalPluginsObject {
	'cli-api': cli.interface;

	'git-remote-provider': gitRemote.Provider;
	hooks: GlobalHooks;

	constructor() {
		this['cli-api'] = new cli.Api();

		this['git-remote-provider'] = new gitRemote.NoopProvider();
		this.hooks = new GlobalHooks();
	}
}

class GlobalHooks {
	init = new AsyncSeriesHook<[]>();
}
