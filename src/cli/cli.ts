import { Command } from 'commander';

import registerCreate from './command/create';
import registerPart from './command/part';
import registerTap from './command/tap';

const program = new Command();
export type Program = typeof program;

program.version('0.0.1');

registerCreate(program);
registerTap(program);
registerPart(program);

program.parse(process.argv);
