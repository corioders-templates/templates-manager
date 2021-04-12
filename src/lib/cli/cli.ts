import registerCreate from './commands/create';
import { Command } from 'commander';

const program = new Command();
export type Program = typeof program;

program.version('0.0.1');

registerCreate(program);

program.parse(process.argv);
