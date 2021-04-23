import * as gitRemoteProvider from './git-remote-provider';

export class Global {
	'git-remote-provider': gitRemoteProvider.Provider;

	constructor() {
		this['git-remote-provider'] = new gitRemoteProvider.NoopProvider();
	}
}
