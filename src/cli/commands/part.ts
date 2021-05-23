import { Program } from '../cli';

export default function (program: Program): void {
	const partCommand = program.command('part');

	partCommand.command('create <partName>').action((partName) => {
		console.log(`part create ${partName}`);
	});
	partCommand.command('remove <partName>').action((partName) => {
		console.log(`part remove ${partName}`);
	});
}
