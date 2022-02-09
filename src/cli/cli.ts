import { Command } from 'commander';

import registerCreate from './command/create';
import registerTap from './command/tap';
import registerUpdate from './command/update';

const program = new Command();
export type Program = typeof program;

program.version('0.0.1');

registerTap(program);
registerCreate(program);
registerUpdate(program);

program.parse(process.argv);
