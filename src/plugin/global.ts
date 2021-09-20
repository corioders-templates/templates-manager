import { AsyncSeriesHook } from 'tapable';

import { cliInterface } from '@/cli/api';
import * as cliDefaultApi from '@/cli/defaultApi';


export interface GlobalPluginsObject {
	'cli-api': cliInterface;

	hooks: GlobalHooks;
}

class GlobalClass implements GlobalPluginsObject {
	'cli-api': cliInterface;

	hooks: GlobalHooks;

	constructor() {
		this['cli-api'] = new cliDefaultApi.CliApi();

		this.hooks = new GlobalHooks();
	}
}

class GlobalHooks {
	init = new AsyncSeriesHook<[]>();
}

export const globalPluginsObject = new GlobalClass();
