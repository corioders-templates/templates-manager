import * as gitRemoteProvider from './git-remote-provider';

export interface Config {
	'git-remote-provider': gitRemoteProvider.Provider;
}
