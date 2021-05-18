import { resolve } from 'path';

import { mkdir, readFile, writeFile } from '@/nodekit/fs';

import { Storage, BaseStorage } from './storage';

export class MapStorage extends BaseStorage implements Storage {
	private map = new Map<string, unknown>();
	constructor() {
		super();
	}
	async get(key: string): Promise<unknown> {
		return this.map.get(key);
	}
	async set(key: string, value: unknown): Promise<void> {
		this.map.set(key, value);
	}
}

export class FsJsonStorage extends BaseStorage implements Storage {
	private object: Record<string, unknown> = {};
	private initialized: boolean = false;
	private defaultJsonFilePath: string;
	private storageFolder: string;
	constructor(storageFolder: string) {
		super();
		this.storageFolder = storageFolder;
		this.defaultJsonFilePath = resolve(storageFolder, 'a.json');
	}
	async get(key: string): Promise<unknown> {
		if (this.initialized === false) await this.initialize();

		const value = this.object[key];
		if (value !== undefined) return value;

		return undefined;
	}
	async set(key: string, value: unknown): Promise<void> {
		if (this.initialized === false) await this.initialize();

		this.object[key] = value;
		await writeFile(this.defaultJsonFilePath, JSON.stringify(this.object));
	}

	private async initialize(): Promise<void> {
		await mkdir(this.storageFolder, { recursive: true });
		await this.readObject();
		this.initialized = true;
	}

	private async readObject(): Promise<void> {
		try {
			const file = await readFile(this.defaultJsonFilePath);
			this.object = JSON.parse(file.toString()) as Record<string, unknown>;
		} catch (_: unknown) {}
	}
}
