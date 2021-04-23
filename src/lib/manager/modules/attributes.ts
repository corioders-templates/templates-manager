import { attributesStorage } from '@/lib/constant/location/modules';
import { Storage, NestedStorage } from '@/nodekit/storage';

export function setAttribute(storage: Storage, importPath: string, key: string, value: unknown): Promise<void> {
	const nested = getNested(storage, importPath);
	return nested.set(key, value);
}

export function getAttribute(storage: Storage, importPath: string, key: string): Promise<unknown> {
	const nested = getNested(storage, importPath);
	return nested.get(key);
}

const coriodersAttributes = new NestedStorage('CORIODERS', attributesStorage);
export function setCoriodersAttribute(importPath: string, key: string, value: unknown): Promise<void> {
	return setAttribute(coriodersAttributes, importPath, key, value);
}

export function getCoriodersAttribute(importPath: string, key: string): Promise<unknown> {
	return getAttribute(coriodersAttributes, importPath, key);
}

const nestedStorages = new Map<string, NestedStorage>();
nestedStorages.set('CORIODERS', coriodersAttributes);
function getNested(storage: Storage, key: string): NestedStorage {
	console.log(key)
	let nested = nestedStorages.get(key);
	if (nested === undefined) nested = new NestedStorage(key, storage);
	return nested;
}
