import simpleGit from 'simple-git';

import { exists } from '@/nodekit/fs';

export async function downloader(importPath: string, absoluteImportPath: string): Promise<void> {
	if (await exists(absoluteImportPath)) {
		await simpleGit(absoluteImportPath).pull('origin', 'master');
		return;
	}
	await simpleGit().clone(`https://${importPath}`, absoluteImportPath);
}