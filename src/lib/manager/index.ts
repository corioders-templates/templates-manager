import { defaultModulesFolder } from '@/lib/constant/location/modules';
import { defaultPluginsDataFolder } from '@/lib/constant/location/plugins';

import { ModulesManager } from './modules';
import { PluginsManager } from './plugins';
import { ProgramManager } from './program';

export const defaultModulesManager = new ModulesManager(defaultModulesFolder);
export const defaultProgramManager = new ProgramManager();
export const defaultPluginsManager = new PluginsManager(defaultPluginsDataFolder, defaultProgramManager, defaultModulesManager);
