import * as fs from 'graceful-fs';

export function readJsonFileSync<T>(path: fs.PathLike, options: fs.BaseEncodingOptions | null = null): T {
	const json = fs.readFileSync(path, options).toString();
	return JSON.parse(json) as T;
}
