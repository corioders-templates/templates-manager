import { writeFile, readFile, unlink } from 'fs/promises';
import { resolve } from 'path';

export default class Provider {
	private readonly tokenFilename = 'token';

	private tokenPath: string;
	private token: string;
	constructor(dataFolder: string) {
		this.tokenPath = resolve(dataFolder, this.tokenFilename);
	}

	async saveToken(token: string): Promise<void> {
		this.token = token;
		await writeFile(this.tokenPath, token);
	}

	async loadToken(): Promise<string> {
		if (this.token !== undefined) return this.token;

		let buffer: Buffer;
		try {
			buffer = await readFile(this.tokenFilename);
		} catch (err: unknown) {
			this.token = '';
			return this.token;
		}

		this.token = buffer.toString();
		return this.token;
	}

	async removeToken(): Promise<void> {
		await unlink(this.tokenPath);
	}
}
