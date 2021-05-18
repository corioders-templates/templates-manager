import * as path from 'path';

import { FsJsonStorage } from '@/nodekit/storage/impl';

import { dotcorioders } from './location';

export const defaultModulesFolder = path.resolve(dotcorioders, 'modules');

const attributesStoragePath = path.resolve(defaultModulesFolder, 'attributes');
export const attributesStorage = new FsJsonStorage(attributesStoragePath);
