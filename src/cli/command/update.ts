import { update } from '@/lib';

import { Program } from '../cli';

export default function (program: Program): void {
	const updateCommand = program.command('update [file/folder]');

	updateCommand.action(async (fileFolderPath) => {

		await update(fileFolderPath);
	});
}
