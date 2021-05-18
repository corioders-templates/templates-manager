import { ModulesManager } from '@/lib';
import { defaultModulesFolder } from '@/lib/constant/location/modules';

import { Program } from '../cli';

export default function (program: Program): void {
	const modulesManager = new ModulesManager(defaultModulesFolder);
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
