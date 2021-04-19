import { download } from './download';
import { getTaps, getTapsAbsolutePaths } from './tap';

export async function update(): Promise<void> {
	const taps = await getTaps();
	const tapsPaths = await getTapsAbsolutePaths();
	const downloads = [];
	for (const i in taps) downloads.push(download(taps[i], tapsPaths[i]));
	await Promise.all(downloads);
}
