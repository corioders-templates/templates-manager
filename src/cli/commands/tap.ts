import { getTaps, tap, untap } from '@/lib';

import { Program } from '../cli';

export default function (program: Program): void {
	const tapCommand = program.command('tap [importPath]');

	tapCommand.action(async (importPath) => {
		if (importPath == undefined) console.log(await getTaps());
		else await tap(importPath);
	});

	const untapCommand = program.command('untap <importPath>');

	untapCommand.action(async (importPath) => {
		await untap(importPath);
	});
}
