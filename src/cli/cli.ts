import { Command } from 'commander';

import registerCreate from './commands/create';
import registerPart from './commands/part';
import registerTap from './commands/tap';

const program = new Command();
export type Program = typeof program;

program.version('0.0.1');

registerCreate(program);
registerTap(program);
registerPart(program);

program.parse(process.argv);
