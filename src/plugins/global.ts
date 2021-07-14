import { AsyncSeriesHook } from 'tapable';

import { CliInterface } from '@/cli/api';
import * as cliDefaultApi from '@/cli/defaultApi';

import * as gitRemote from './git-remote-provider';

export interface GlobalPluginsObject {
	'cli-api': CliInterface;

	'git-remote-provider': gitRemote.Provider;
	hooks: GlobalHooks;
}

class GlobalClass implements GlobalPluginsObject {
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

export const globalPluginsObject = new GlobalClass();
