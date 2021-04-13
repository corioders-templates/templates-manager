import { Config } from '@/lib/config';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

export enum ProviderType {
	github,
}

export default class GitRemoteProvider {
	private providerType;
	constructor(providerType: ProviderType) {
		this.providerType = providerType;
	}

	apply(dataFolder: string, config: Config): void {
		// provider type has only one option, for now
		config['git-remote-provider'] = new GithubProvider(dataFolder);
	}
}

const tokenFile = 'token';

class GithubProvider {
	dataFolder: string;
	constructor(dataFolder: string) {
		this.dataFolder = dataFolder;
	}

	async login(token: string): Promise<void> {
		writeFile(resolve(this.dataFolder, tokenFile), token);
	}

	async createRepo(organizationName: string, repoName: string): Promise<void> {}
	async isLogged(): Promise<boolean> {
		return false;
	}
	async signout(): Promise<void> {}
}
