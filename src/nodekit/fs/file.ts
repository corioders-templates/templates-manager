import { lstat, readdir } from '.';
import { readFile } from 'fs';
import { resolve } from 'path';

export type FileOrFolder = File | Folder;

export class File {
	private path: string;
	private contents: Buffer;
	constructor(path: string, contents?: Buffer) {
		this.path = path;
		if (contents !== undefined) this.contents = contents;
	}

	static async fromFilePath(path: string): Promise<File> {
		// replace with readFile from nodekit/fs after https://corioders.atlassian.net/browse/CPM-149
		const contents = await new Promise<Buffer>((resolve, reject) => {
			readFile(path, (err, data) => {
				if (err !== null) {
					reject(err);
					return;
				}

				resolve(data);
			});
		});

		return new File(path, contents);
	}
}

export class Folder {
	private path: string;
	private files: FileOrFolder[];
	constructor(path: string, files: FileOrFolder[]) {
		this.path = path;
		this.files = files;
	}

	static async fromFolderPath(rootPath: string): Promise<Folder> {
		const filesPromises: Promise<FileOrFolder>[] = [];

		const fileNames = await readdir(rootPath);
		for (const fileName of fileNames) {
			const filePath = resolve(rootPath, fileName);

			const stats = await lstat(filePath);
			if (stats.isDirectory()) {
				filesPromises.push(Folder.fromFolderPath(filePath));
				continue;
			}

			filesPromises.push(File.fromFilePath(filePath));
		}

		const files = await Promise.all(filesPromises);

		return new Folder(rootPath, files);
	}
}
