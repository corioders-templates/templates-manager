import { create } from '@/lib';

import { Program } from '../cli';

export default function (program: Program): void {
	const command = program.command('create <projectName>');

	command.action((name) => {
		create(name);
	});
}
