import { spawn as spawnCallback, exec as execCallback } from 'child_process';
import { promisify } from 'util';

export const spawn = promisify(spawnCallback);
export const exec = promisify(execCallback);
