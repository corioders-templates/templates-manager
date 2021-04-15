import { getTaps, tap, untap } from '@/lib';

import { Program } from '../cli';

export default function (program: Program): void {
	const tapCommand = program.command('tap [url]');

	tapCommand.action(async (url) => {
		if (url == undefined) console.log(await getTaps());
		else await tap(url);
	});

	const untapCommand = program.command('untap <url>');

	untapCommand.action((url) => {
		untap(url);
	});

	const tapsCommand = program.command('taps');

	tapsCommand.action(async () => {
		console.log(await getTaps());
	});
}
