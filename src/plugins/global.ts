import { AsyncSeriesHook } from 'tapable';

import { cliInterface } from '@/cli/api';
import * as cliDefaultApi from '@/cli/defaultApi';

import * as gitRemote from './git-remote-provider';

export class GlobalPluginsObject {
	'cli-api': cliInterface;

	'git-remote-provider': gitRemote.Provider;
	hooks: GlobalHooks;

	constructor() {
		this['cli-api'] = new cliDefaultApi.CliApi();

		this['git-remote-provider'] = new gitRemote.NoopProvider();
		this.hooks = new GlobalHooks();
	}
}

class GlobalHooks {
	init = new AsyncSeriesHook<[]>();
}
