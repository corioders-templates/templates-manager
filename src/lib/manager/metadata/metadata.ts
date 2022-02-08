import { readFile, writeFile } from '@corioders/nodekit/fs';
import * as path from 'path';

export interface Metadata {
	[key: string]: unknown;
}

export async function getMetadata(key: string, projectPath: string, metadataFileName: string): Promise<unknown> {
	const metadataFilePath = path.join(projectPath, metadataFileName);
	const metadataFile = await readFile(metadataFilePath);
	const metadataObject = JSON.parse(metadataFile) as Metadata;

	return metadataObject[key];
}

export async function setMetadata(key: string, value: unknown, projectPath: string, metadataFileName: string): Promise<void> {
	const metadataFilePath = path.join(projectPath, metadataFileName);
	const metadataFile = await readFile(metadataFilePath);
	const metadataObject = JSON.parse(metadataFile) as Metadata;

	metadataObject[key] = value;
	const setMetadataFile = JSON.stringify(metadataObject);
	await writeFile(metadataFilePath, setMetadataFile);
}
