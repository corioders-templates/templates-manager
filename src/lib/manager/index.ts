import { defaultModulesFolder } from '@/lib/constant/location/modules';
import { defaultPathsJsonFilename, defaultStoragePath } from '@/lib/constant/location/project';

import { CoriodersManager } from './corioders';
import { ModulesManager } from './modules';

export const defaultCoriodersManager = new CoriodersManager(defaultStoragePath, defaultPathsJsonFilename);
export const defaultModulesManager = new ModulesManager(defaultModulesFolder);
