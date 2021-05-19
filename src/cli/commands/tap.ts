import { modulesManager } from '@/lib/manager';

import { Program } from '../cli';

export default function (program: Program): void {
	const tapCommand = program.command('tap [importPath]');

	tapCommand.action(async (importPath) => {
		if (importPath == undefined) console.log(await modulesManager.getTaps());
		else await modulesManager.tap(importPath);
	});

	const untapCommand = program.command('untap <importPath>');

	untapCommand.action(async (importPath) => {
		await modulesManager.untap(importPath);
	});
}
