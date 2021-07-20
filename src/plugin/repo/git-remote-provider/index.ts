import { Storage } from '@corioders/nodekit/storage';

import { GlobalPluginsObject } from '@/plugin/global';

import GithubProvider from './githubProvider';

export enum ProviderType {
	github,
}

export default class GitRemoteProvider {
	private providerType: ProviderType;
	constructor(providerType: ProviderType = ProviderType.github) {
		this.providerType = providerType;
	}

	execute(storage: Storage, global: GlobalPluginsObject): void {
		switch (this.providerType) {
			case ProviderType.github:
				global['git-remote-provider'] = new GithubProvider(storage);
		}
		// provider type has only one option, for now
	}
}
