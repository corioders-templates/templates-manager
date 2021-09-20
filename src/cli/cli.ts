import { Command } from 'commander';

import registerTap from './commands/tap';
import registerCreate from './commands/create';

const program = new Command();
export type Program = typeof program;

program.version('0.0.1');

registerTap(program);
registerCreate(program)

program.parse(process.argv);
