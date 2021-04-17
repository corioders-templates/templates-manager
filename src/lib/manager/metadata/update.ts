import { downloader } from './downloader';
import { getTaps, getTapsAbsolutePaths } from './tap';

export async function update(): Promise<void> {
	const taps = await getTaps();
	const tapsPaths = await getTapsAbsolutePaths();
	for (const i in taps) await downloader(taps[i], tapsPaths[i]);
}
