import * as fs from 'graceful-fs';

export function mkdir(path: fs.PathLike, options: fs.MakeDirectoryOptions | null = null): Promise<void> {
	return new Promise(function (resolve, reject) {
		fs.mkdir(path, options, function (error) {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export function unlink(path: fs.PathLike): Promise<void> {
	return new Promise(function (resolve, reject) {
		fs.unlink(path, function (error) {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export function writeFile(path: fs.PathLike | number, data: string | NodeJS.ArrayBufferView, options: fs.WriteFileOptions = null): Promise<void> {
	return new Promise(function (resolve, reject) {
		fs.writeFile(path, data, options, function (error) {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export function readFile(path: fs.PathLike | number, options: fs.BaseEncodingOptions | null = null): Promise<string> {
	return new Promise(function (resolve, reject) {
		fs.readFile(path, options, function (error, data) {
			if (error) {
				reject(error);
				return;
			}
			resolve(data.toString());
		});
	});
}

export function readdir(path: fs.PathLike): Promise<string[]> {
	return new Promise(function (resolve, reject) {
		fs.readdir(path, function (error, files) {
			if (error) {
				reject(error);
				return;
			}
			resolve(files);
		});
	});
}

export function rmdir(path: fs.PathLike, options: fs.RmDirOptions = { recursive: true }): Promise<void> {
	return new Promise(function (resolve, reject) {
		fs.rmdir(path, options, function (error) {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export function lstat(path: fs.PathLike): Promise<fs.Stats> {
	return new Promise(function (resolve, reject) {
		fs.lstat(path, function (error, stats) {
			if (error) {
				reject(error);
				return;
			}
			resolve(stats);
		});
	});
}

export function access(path: fs.PathLike, mode: number | undefined): Promise<void> {
	return new Promise(function (resolve, reject) {
		fs.access(path, mode, function (error) {
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
