import { tap } from '@/lib';

import { Program } from '../cli';

export default function (program: Program): void {
	const tapCommand = program.command('tap <url>');

	tapCommand.action((url) => {
		tap(url);
	});
}
