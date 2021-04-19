import * as path from 'path';

import { dotcorioders } from './location';

export const metadataFolder = path.resolve(dotcorioders, 'metadata');
export const tapsFile = path.resolve(metadataFolder, 'taps.json');
