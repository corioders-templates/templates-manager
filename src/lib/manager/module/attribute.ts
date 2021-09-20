import { Storage, NestedStorage } from '@corioders/nodekit/storage';

import { attributeStorage } from '@/lib/constant/location/module';

export function setAttribute(storage: Storage, importPath: string, key: string, value: unknown): Promise<void> {
	const nested = getNested(storage, importPath);
	return nested.set(key, value);
}

export function getAttribute(storage: Storage, importPath: string, key: string): Promise<unknown> {
	const nested = getNested(storage, importPath);
	return nested.get(key);
}

const coriodersAttribute = new NestedStorage('CORIODERS', attributeStorage);
export function setCoriodersAttribute(importPath: string, key: string, value: unknown): Promise<void> {
	return setAttribute(coriodersAttribute, importPath, key, value);
}

export function getCoriodersAttribute(importPath: string, key: string): Promise<unknown> {
	return getAttribute(coriodersAttribute, importPath, key);
}

const nestedStorage = new Map<string, NestedStorage>();
function getNested(storage: Storage, key: string): NestedStorage {
	let nested = nestedStorage.get(key);
	if (nested === undefined) {
		nested = new NestedStorage(key, storage);
		nestedStorage.set(key, nested);
	}
	return nested;
}
