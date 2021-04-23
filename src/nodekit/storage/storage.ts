export interface Bucket {
	[key: string]: unknown;
}

export interface Storage {
	get(key: string): Promise<unknown | undefined>;
	set(key: string, value: unknown): Promise<void>;

	getNested?(key: string): Promise<Bucket>;
	setNested?(key: string, bucket: Bucket): Promise<void>;
}

export abstract class BaseStorage implements Storage {
	abstract get(key: string): Promise<unknown | undefined>;
	abstract set(key: string, value: unknown): Promise<void>;

	private readonly originalSet: (key: string, value: unknown) => Promise<void>;
	private readonly usedNestedKeys: Set<string>;
	constructor() {
		// Override set so user can't set "_" because this is used for NestedStorage.
		this.originalSet = this.set;
		this.set = async (key: string, value: unknown): Promise<void> => {
			if (key === '_') throw new Error(`'_' is reserved key please choose other name`);
			await this.originalSet(key, value);
		};
	}
}

interface BaseStoragePrivate {
	originalSet: (key: string, value: unknown) => Promise<void>;
	usedNestedKeys: Set<string>;
}

export class NestedStorage extends BaseStorage implements Storage {
	private readonly key: string;
	private readonly parentStorage: Storage;

	private readonly baseStoragePrivate: BaseStoragePrivate;

	constructor(key: string, parentStorage: Storage) {
		if (!(parentStorage instanceof BaseStorage)) throw new Error('To use nested storage parentStorage must extend BaseStorage');
		parentStorage = parentStorage as Storage;
		super();

		// We are sure that this would work because we know that `parentStorage` is instance of BaseStorage and BaseStorage has private properties defined in BaseStoragePrivate.
		this.baseStoragePrivate = (parentStorage as unknown) as BaseStoragePrivate;

		if (this.baseStoragePrivate.usedNestedKeys === undefined) this.baseStoragePrivate.usedNestedKeys = new Set<string>();
		if (this.baseStoragePrivate.usedNestedKeys.has(key)) throw new Error('NestedStorage key must be unique');
		this.baseStoragePrivate.usedNestedKeys.add(key);

		this.key = key;
		this.parentStorage = parentStorage;

		if (parentStorage.getNested !== undefined) this.getNestedBucket = parentStorage.getNested;
		if (parentStorage.setNested !== undefined) this.setNestedBucket = parentStorage.setNested;
	}
	async get(key: string): Promise<unknown> {
		const bucket = await this.getNestedBucket(this.key);
		return bucket[key];
	}
	async set(key: string, value: unknown): Promise<void> {
		const bucket = await this.getNestedBucket(this.key);
		bucket[key] = value;
		await this.setNestedBucket(this.key, bucket);
	}

	private async getNestedBucket(key: string): Promise<Bucket> {
		let _bucket = (await this.parentStorage.get('_')) as Bucket | undefined;
		_bucket ??= {};

		let bucket = _bucket[key] as Bucket | undefined;
		bucket ??= {};
		return bucket;
	}

	private async setNestedBucket(key: string, bucket: Bucket): Promise<void> {
		let _bucket = (await this.parentStorage.get('_')) as Bucket | undefined;
		_bucket ??= {};
		_bucket[key] = bucket;

		await this.baseStoragePrivate.originalSet.call(this.baseStoragePrivate, '_', _bucket);
	}
}
