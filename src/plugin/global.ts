import { AsyncSeriesHook } from 'tapable';

import * as cli from './cli-api';

export class GlobalPluginObject {
	'cli-api': cli.api;

	hooks: GlobalHooks;

	constructor() {
		this['cli-api'] = new cli.DefaultApi();

		this.hooks = new GlobalHooks();
	}
}

class GlobalHooks {
	init = new AsyncSeriesHook<[]>();
}
