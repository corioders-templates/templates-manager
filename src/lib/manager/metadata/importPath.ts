export function getRepoPath(importPath: string): string {
	const importPathArray = importPath.split('/');
	const repoPath: string[] = [];
	for (let i = 0; i < 3; i++) repoPath.push(importPathArray[i]);
	return repoPath.join('/');
}
