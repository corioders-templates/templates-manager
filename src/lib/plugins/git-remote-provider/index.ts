import { Config } from '@/lib/config';

import GithubProvider from './githubProvider';

export enum ProviderType {
	github,
}

export default class GitRemoteProvider {
	private providerType: ProviderType;
	constructor(providerType: ProviderType) {
		this.providerType = providerType;
	}

	apply(dataFolder: string, config: Config): void {
		switch (this.providerType) {
			case ProviderType.github:
				config['git-remote-provider'] = new GithubProvider(dataFolder);
		}
		// provider type has only one option, for now
	}
}
