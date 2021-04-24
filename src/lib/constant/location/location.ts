import { homedir as oshomedir } from 'os';
import { resolve } from 'path';

export const homedir = oshomedir();
export const dotcorioders = resolve(homedir, '.corioders');

export const rootFolder = resolve(__dirname, '..', '..', '..', '..');
export const packageJsonFile = resolve(rootFolder, 'package.json');
export const outFolder = resolve(rootFolder, 'out');
