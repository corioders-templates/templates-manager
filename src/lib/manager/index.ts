import { defaultModulesFolder } from '@/lib/constant/location/modules';
import { defaultPluginsDataFolder } from '@/lib/constant/location/plugins';
import { defaultPathsJsonFilename, defaultStoragePath } from '@/lib/constant/location/project';

import { ModulesManager } from './modules';
import { PluginsManager } from './plugins';
import { ProgramManager } from './program';
import { ProjectManager } from './project';

export const defaultModulesManager = new ModulesManager(defaultModulesFolder);
export const defaultProgramManager = new ProgramManager();
export const defaultPluginsManager = new PluginsManager(defaultPluginsDataFolder, defaultProgramManager, defaultModulesManager);
export const defaultProjectManager = new ProjectManager(defaultStoragePath, defaultPathsJsonFilename);
