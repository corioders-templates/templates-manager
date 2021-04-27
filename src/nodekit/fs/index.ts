import * as fs from 'graceful-fs';

export function mkdir(path: fs.PathLike, options: fs.MakeDirectoryOptions = { recursive: true }): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.mkdir(path, options, (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export function unlink(path: fs.PathLike): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.unlink(path, (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export function writeFile(path: fs.PathLike | number, data: string | NodeJS.ArrayBufferView, options: fs.WriteFileOptions = null): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, data, options, (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export function readFile(path: fs.PathLike | number, options: fs.BaseEncodingOptions | null = null): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.readFile(path, options, (error, data) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(data.toString());
		});
	});
}

export function readdir(path: fs.PathLike): Promise<string[]> {
	return new Promise((resolve, reject) => {
		fs.readdir(path, (error, files) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(files);
		});
	});
}

export function rmdir(path: fs.PathLike, options: fs.RmDirOptions = { recursive: true }): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.rmdir(path, options, (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export function lstat(path: fs.PathLike): Promise<fs.Stats> {
	return new Promise((resolve, reject) => {
		fs.lstat(path, (error, stats) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(stats);
		});
	});
}

export function access(path: fs.PathLike, mode: number | undefined): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.access(path, mode, (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export function symlink(target: fs.PathLike, path: fs.PathLike, type: fs.symlink.Type | undefined | null): Promise<void> {
	return new Promise(function (resolve, reject) {
		fs.symlink(target, path, type, function (error) {
			console.log(error);
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export async function exists(path: fs.PathLike): Promise<boolean> {
	try {
		await access(path, fs.constants.F_OK);
		return true;
	} catch (_: unknown) {
		return false;
	}
}

export async function readJsonFile<T>(path: fs.PathLike, options: fs.BaseEncodingOptions | null = null): Promise<T> {
	const json = await readFile(path, options);
	return JSON.parse(json) as T;
}
