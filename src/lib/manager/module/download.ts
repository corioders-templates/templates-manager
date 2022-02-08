import { exists } from '@corioders/nodekit/fs';
import { resolve } from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

import { setCoriodersAttribute } from './attribute';
import { importPathToVersion } from './importPath';

export async function download(importPath: string, downloadFolderPath: string): Promise<void> {
	const { importPathWithoutVersion, version } = importPathToVersion(importPath);
	const repoPath = getRepoPath(importPathWithoutVersion);

	const checkoutToVersion = async function (git: SimpleGit): Promise<void> {
		if (version === null) await git.checkout('master');
		else await git.checkout(version);
	};

	const absoluteRepoPath = resolve(downloadFolderPath, repoPath);
	if (await exists(absoluteRepoPath)) {
		const git = simpleGit(absoluteRepoPath);
		const pullResult = await git.pull('origin', 'master');
		await checkoutToVersion(git);

		// No update were made.
		if (pullResult.files.length === 0 && pullResult.summary.changes === 0 && pullResult.summary.deletions === 0 && pullResult.summary.insertions === 0) return;
		await setHashAttribute(importPathWithoutVersion, git);
		return;
	}

	let git = simpleGit();
	await git.clone(`https://${repoPath}`, absoluteRepoPath, ['--branch', 'master', '--single-branch']);

	git = simpleGit(absoluteRepoPath);
	await checkoutToVersion(git);

	await setHashAttribute(importPathWithoutVersion, git);
}

async function setHashAttribute(importPathWithoutVersion: string, git: SimpleGit): Promise<void> {
	const hash = await git.revparse('HEAD');
	await setCoriodersAttribute(importPathWithoutVersion, 'HASH', hash);
}

// import path (github.com/user/repo/directory) -> repo path (github.com/user/repo)
function getRepoPath(importPathWithoutVersion: string): string {
	const importPathArray = importPathWithoutVersion.split('/');
	const repoPath: string[] = [];
	for (let i = 0; i < 3; i++) repoPath.push(importPathArray[i]);
	return repoPath.join('/');
}
