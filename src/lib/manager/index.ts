import { defaultModulesFolder } from '@/lib/constant/location/modules';
import { defaultPluginsDataFolder } from '@/lib/constant/location/plugins';

import { ModulesManager } from './modules';
import { PluginsManager } from './plugins';
import { ProgramManager } from './program';
import { TemplatesManager } from './templates';

export const defaultModulesManager = new ModulesManager(defaultModulesFolder);
export const defaultProgramManager = new ProgramManager();
export const defaultPluginsManager = new PluginsManager(defaultPluginsDataFolder, defaultProgramManager, defaultModulesManager);
export const defaultTemplateManager = new TemplatesManager(defaultProgramManager, defaultModulesManager);
