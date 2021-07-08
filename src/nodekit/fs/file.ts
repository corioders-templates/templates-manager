import { lstat, readdir } from '.';
import { readFile } from 'graceful-fs';
import { resolve } from 'path';

export type FileOrFolder = File | Folder;

export class File {
	private path: string;
	private content: Buffer | string = '';
	constructor(path: string, content?: Buffer | string) {
		this.path = path;
		if (content !== undefined) this.content = content;
	}

	getContentString(): string {
		if (!(this.content instanceof Buffer)) return this.content;
		return this.content.toString();
	}

	setContentString(contents: string): void {
		this.content = contents;
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
	private structure: FileOrFolder[];
	constructor(path: string, structure: FileOrFolder[]) {
		this.path = path;
		this.structure = structure;
	}

	getStructure(): FileOrFolder[] {
		return this.structure;
	}

	private cache_getAllFiles: File[] | null = null;
	getAllFiles(): File[] {
		if (this.cache_getAllFiles !== null) return this.cache_getAllFiles;

		const allFiles: File[] = [];
		const runner = (structure: FileOrFolder[]): void => {
			for (const structureElem of structure) {
				if (structureElem instanceof Folder) {
					// run recursively on folders
					runner(structureElem.getStructure());
					return;
				}

				allFiles.push(structureElem);
			}
		};

		runner(this.structure);
		this.cache_getAllFiles = allFiles;
		return allFiles;
	}

	private invalidate(): void {
		this.cache_getAllFiles = null;
	}

	static async fromFolderPath(rootPath: string): Promise<Folder> {
		const structurePromises: Promise<FileOrFolder>[] = [];

		const fileNames = await readdir(rootPath);
		for (const fileName of fileNames) {
			const filePath = resolve(rootPath, fileName);

			const stats = await lstat(filePath);
			if (stats.isDirectory()) {
				structurePromises.push(Folder.fromFolderPath(filePath));
				continue;
			}

			structurePromises.push(File.fromFilePath(filePath));
		}

		const structure = await Promise.all(structurePromises);

		return new Folder(rootPath, structure);
	}
}
