import { Program } from '../cli';
import { create } from '@/lib';

export default function (program: Program): void {
	const command = program.command('create <projectName>');

	command.action((name) => {
		create(name);
	});
}
