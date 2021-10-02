import { FsJsonStorage } from '@corioders/nodekit/storage/impl';
import * as path from 'path';

import { dotcorioders } from './location';

export const defaultModuleFolder = path.resolve(dotcorioders, 'modules');

const attributeStoragePath = path.resolve(defaultModuleFolder, 'attribute');
export const attributeStorage = new FsJsonStorage(attributeStoragePath);
