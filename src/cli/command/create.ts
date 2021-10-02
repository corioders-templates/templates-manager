import { resolve } from 'path';

import { create } from '@/lib';
import { defaultPluginManager } from '@/lib/manager';

import { Program } from '../cli';

export default function (program: Program): void {
	const createCommand = program.command('create [projectName]');

	createCommand.action(async (projectName) => {
		const projectPath = resolve(process.cwd(), projectName);

		// Select template.
		const templateImportPath = await defaultPluginManager.globalPluginObject['cli-api'].input('template import path', undefined, undefined);

		// Create template.
		const templateFolder = await create(templateImportPath);
		templateFolder.save(projectPath);
	});
}
