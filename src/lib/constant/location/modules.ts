import { dotcorioders } from './location';
import { FsJsonStorage } from '@/nodekit/storage/impl';
import * as path from 'path';

export const modulesFolder = path.resolve(dotcorioders, 'modules');
export const tapsFile = path.resolve(modulesFolder, 'taps.json');
export const downloadsFolder = path.resolve(modulesFolder, 'downloads');

const attributesStoragePath = path.resolve(modulesFolder, 'attributes');
export const attributesStorage = new FsJsonStorage(attributesStoragePath);
