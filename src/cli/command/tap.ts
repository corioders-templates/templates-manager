import { defaultModuleManager } from '@/lib/manager';

import { Program } from '../cli';

export default function (program: Program): void {
	const tapCommand = program.command('tap [importPath]');

	tapCommand.action(async (importPath) => {
		if (importPath == undefined) console.log(await defaultModuleManager.getTap());
		else await defaultModuleManager.tap(importPath);
	});

	const untapCommand = program.command('untap <importPath>');

	untapCommand.action(async (importPath) => {
		await defaultModuleManager.untap(importPath);
	});
}
