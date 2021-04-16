import * as gitRemoteProvider from './git-remote-provider';

export interface Global {
	'git-remote-provider'?: gitRemoteProvider.Provider;
}
