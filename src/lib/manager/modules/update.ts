import { download } from './download';
import { getTaps, getTapsAbsolutePaths } from './tap';

export async function update(modulesFolderPath: string, tapsFilePath: string): Promise<void> {
	const taps = await getTaps(modulesFolderPath);
	const tapsPaths = await getTapsAbsolutePaths(modulesFolderPath, tapsFilePath);
	const downloads = [];
	for (const i in taps) downloads.push(download(taps[i], tapsPaths[i]));
	await Promise.all(downloads);
}
