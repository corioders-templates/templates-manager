import { defaultModuleFolder } from '@/lib/constant/location/module';
import { defaultPluginDataFolder } from '@/lib/constant/location/plugin';

import { ModuleManager } from './module';
import { PluginManager } from './plugin';
import { ProgramManager } from './program';
import { TemplateManager } from './template';

export const defaultModuleManager = new ModuleManager(defaultModuleFolder);
export const defaultProgramManager = new ProgramManager();
export const defaultPluginManager = new PluginManager(defaultPluginDataFolder, defaultProgramManager, defaultModuleManager);
export const defaultTemplateManager = new TemplateManager(defaultProgramManager, defaultModuleManager);
