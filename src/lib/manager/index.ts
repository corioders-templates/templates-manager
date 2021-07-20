import { defaultModuleFolder } from '@/lib/constant/location/module';
import { defaultPluginDataFolder } from '@/lib/constant/location/plugin';
import { defaultPathJsonFilename, defaultStoragePath } from '@/lib/constant/location/project';

import { ModuleManager } from './module';
import { PluginManager } from './plugin';
import { ProgramManager } from './program';
import { ProjectManager } from './project';

export const defaultModuleManager = new ModuleManager(defaultModuleFolder);
export const defaultProgramManager = new ProgramManager();
export const defaultPluginManager = new PluginManager(defaultPluginDataFolder, defaultProgramManager, defaultModuleManager);
export const defaultProjectManager = new ProjectManager(defaultStoragePath, defaultPathJsonFilename);
