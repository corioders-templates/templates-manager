import { Storage } from '@corioders/nodekit/storage';

export default class Provider {
	private readonly tokenKey = 't';
	private readonly storage: Storage;

	private token: string | undefined;
	constructor(storage: Storage) {
		this.storage = storage;
	}

	async saveToken(token: string): Promise<void> {
		this.token = token;
		await this.storage.set(this.tokenKey, token);
	}

	async loadToken(): Promise<string> {
		if (this.token !== undefined) return this.token;
		return (await this.storage.get(this.tokenKey)) as string;
	}

	async removeToken(): Promise<void> {
		this.token = undefined;
		await this.storage.set(this.tokenKey, ''); // TODO: CPM-116
	}
}
