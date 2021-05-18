import * as path from 'path';

import { FsJsonStorage } from '@/nodekit/storage/impl';

import { dotcorioders } from './location';

export const defalutModulesFolder = path.resolve(dotcorioders, 'modules');

const attributesStoragePath = path.resolve(defalutModulesFolder, 'attributes');
export const attributesStorage = new FsJsonStorage(attributesStoragePath);
