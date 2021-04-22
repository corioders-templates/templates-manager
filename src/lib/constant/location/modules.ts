import { dotcorioders } from './location';
import * as path from 'path';

export const modulesFolder = path.resolve(dotcorioders, 'modules');
export const downloadsFolder = path.resolve(modulesFolder, 'downloads');
export const tapsFile = path.resolve(downloadsFolder, 'taps.json');
