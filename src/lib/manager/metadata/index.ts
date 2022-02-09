import { File, Folder } from '@corioders/nodekit/fs/file';
import * as path from 'path';

import { getMetadata, Metadata, setMetadata } from './metadata';
import { getProjectRootPath } from './project';

export class MetadataManager {
	static METADATA_FILE_NAME = '.corioders';

	initMetadata(folder: Folder, initialMetadata?: Metadata): void {
		const folderPath = folder.path;
		const metadataFilePath = path.join(folderPath, MetadataManager.METADATA_FILE_NAME);

		const metadata = initialMetadata === undefined ? '{}' : JSON.stringify(initialMetadata);
		const metadataFile = new File(metadataFilePath, metadata);
		folder.getStructure().push(metadataFile);
	}

	async getMetadata(key: string): Promise<unknown | null> {
		const projectPath = await MetadataManager.getProjectRootPath();
		if (projectPath === null) return null;

		return getMetadata(key, projectPath, MetadataManager.METADATA_FILE_NAME);
	}

	async setMetadata(key: string, value: unknown): Promise<void> {
		const projectPath = await MetadataManager.getProjectRootPath();
		if (projectPath === null) throw new Error('Cannot set metadata when project path is null, there is no project.');

		setMetadata(key, value, projectPath, MetadataManager.METADATA_FILE_NAME);
	}

	static async isInProject(): Promise<boolean> {
		if ((await MetadataManager.getProjectRootPath()) === null) return false;
		return true;
	}

	// How gar up from cwd are we searching the .corioders file.
	private static MAX_SEARCH_DEPTH = 20;
	static async getProjectRootPath(): Promise<string | null> {
		return getProjectRootPath(process.cwd(), this.METADATA_FILE_NAME, this.MAX_SEARCH_DEPTH);
	}
}
