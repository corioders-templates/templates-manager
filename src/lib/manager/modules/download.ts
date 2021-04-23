import { getCoriodersAttribute, setCoriodersAttribute } from './attributes';
import { exists } from '@/nodekit/fs';
import simpleGit, { SimpleGit } from 'simple-git';

export async function download(importPath: string, absoluteImportPath: string): Promise<void> {
	if (await exists(absoluteImportPath)) {
		const git = simpleGit(absoluteImportPath);
		const pullResult = await git.pull('origin', 'master');
		if (pullResult.files.length === 0 && pullResult.summary.changes === 0 && pullResult.summary.deletions === 0 && pullResult.summary.insertions === 0) {
			// No update were made.
			return;
		}

		await setHashAttribute(importPath, git);
		return;
	}

	let git = simpleGit();
	await git.clone(`https://${importPath}`, absoluteImportPath, ['--depth', '1', '--branch', 'master', '--single-branch']);

	git = simpleGit(absoluteImportPath);
	await setHashAttribute(importPath, git);
}

async function setHashAttribute(importPath: string, git: SimpleGit): Promise<void> {
	const hash = await git.revparse('master');
	await setCoriodersAttribute(importPath, 'HASH', hash);
}
