import { Global } from '@/plugins/global';

import GithubProvider from './githubProvider';

export enum ProviderType {
	github,
}

export default class GitRemoteProvider {
	private providerType: ProviderType;
	constructor(providerType: ProviderType) {
		this.providerType = providerType;
	}

	apply(dataFolder: string, global: Global): void {
		switch (this.providerType) {
			case ProviderType.github:
				global['git-remote-provider'] = new GithubProvider(dataFolder);
		}
		// provider type has only one option, for now
	}
}
