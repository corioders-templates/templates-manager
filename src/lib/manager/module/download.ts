import { exists } from '@corioders/nodekit/fs';
import { resolve } from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

import { setCoriodersAttribute } from './attribute';

export async function download(importPath: string, downloadFolderPath: string): Promise<void> {
	const repoPath = getRepoPath(importPath);
	const absoluteRepoPath = resolve(downloadFolderPath, repoPath);
	if (await exists(absoluteRepoPath)) {
		const git = simpleGit(absoluteRepoPath);
		const pullResult = await git.pull('origin', 'master');
		if (pullResult.files.length === 0 && pullResult.summary.changes === 0 && pullResult.summary.deletions === 0 && pullResult.summary.insertions === 0) {
			// No update were made.
			return;
		}

		await setHashAttribute(importPath, git);
		return;
	}

	let git = simpleGit();
	await git.clone(`https://${repoPath}`, absoluteRepoPath, ['--depth', '1', '--branch', 'master', '--single-branch']);

	git = simpleGit(absoluteRepoPath);
	await setHashAttribute(repoPath, git);
}

async function setHashAttribute(importPath: string, git: SimpleGit): Promise<void> {
	const hash = await git.revparse('master');
	await setCoriodersAttribute(importPath, 'HASH', hash);
}

// import path (github.com/user/repo/directory) -> repo path (github.com/user/repo)
function getRepoPath(importPath: string): string {
	const importPathArray = importPath.split('/');
	const repoPath: string[] = [];
	for (let i = 0; i < 3; i++) repoPath.push(importPathArray[i]);
	return repoPath.join('/');
}
