import { tap, untap } from '@/lib';

import { Program } from '../cli';

export default function (program: Program): void {
	const tapCommand = program.command('tap <url>');

	tapCommand.action((url) => {
		tap(url);
	});

	const untapCommand = program.command('untap <url>');

	untapCommand.action((url) => {
		untap(url);
	});
}
