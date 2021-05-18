import { download } from './download';
import { getTaps, getTapsAbsolutePaths } from './tap';

export async function update(downloadsFolderPath: string, tapsFilePath: string): Promise<void> {
	const taps = await getTaps(tapsFilePath);
	const tapsPaths = await getTapsAbsolutePaths(downloadsFolderPath, tapsFilePath);
	const downloads = [];
	for (const i in taps) downloads.push(download(taps[i], tapsPaths[i]));
	await Promise.all(downloads);
}
