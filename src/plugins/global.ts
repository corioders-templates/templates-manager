import { AsyncSeriesHook } from 'tapable';

import { CliInterface } from '@/cli/api';
import * as cliDefaultApi from '@/cli/defaultApi';

import * as gitRemote from './git-remote-provider';

export class GlobalPluginsObject {
	'cli-api': CliInterface;

	'git-remote-provider': gitRemote.Provider;
	hooks: GlobalHooks;

	constructor() {
		this['cli-api'] = cliDefaultApi.cliApi;

		this['git-remote-provider'] = new gitRemote.NoopProvider();
		this.hooks = new GlobalHooks();
	}
}

class GlobalHooks {
	init = new AsyncSeriesHook<[]>();
}
