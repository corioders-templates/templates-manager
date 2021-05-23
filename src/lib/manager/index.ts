import { defaultModulesFolder } from '@/lib/constant/location/modules';
import { defaultPluginsDataFolder } from '@/lib/constant/location/plugins';
import { defaultPathsJsonFilename, defaultStoragePath } from '@/lib/constant/location/project';

import { CoriodersManager } from './corioders';
import { ModulesManager } from './modules';
import { PluginsManager } from './plugins';
import { ProgramManager } from './program';

export const defaultCoriodersManager = new CoriodersManager(defaultStoragePath, defaultPathsJsonFilename);
export const defaultModulesManager = new ModulesManager(defaultModulesFolder);
export const defaultPluginsManager = new PluginsManager(defaultPluginsDataFolder, new ProgramManager(), defaultModulesManager);
export const defaultProgramManager = new ProgramManager();
