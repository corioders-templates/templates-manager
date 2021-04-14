import { spawn as spawnCallback } from 'child_process';
import { promisify } from 'util';

export const spawn = promisify(spawnCallback);
