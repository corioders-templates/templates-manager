import { download } from './download';
import { getTaps } from './tap';

export async function update(downloadsFolderPath: string, tapsFilePath: string): Promise<void> {
	const taps = await getTaps(tapsFilePath);
	const downloads = [];
	for (const i in taps) downloads.push(download(taps[i], downloadsFolderPath));
	await Promise.all(downloads);
}
