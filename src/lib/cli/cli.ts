import { Command } from 'commander';

import registerCreate from './commands/create';
import registerTap from './commands/tap';

const program = new Command();
export type Program = typeof program;

program.version('0.0.1');

registerCreate(program);
registerTap(program);

program.parse(process.argv);
