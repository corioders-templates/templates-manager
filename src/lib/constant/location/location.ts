import { homedir as oshomedir } from 'os';
import { resolve } from 'path';

export const homedir = oshomedir();
export const dotcorioders = resolve(homedir, '.corioders');
