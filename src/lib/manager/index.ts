import { defaultModuleFolder } from '@/lib/constant/location/module';
import { defaultPluginDataFolder } from '@/lib/constant/location/plugin';

import { MetadataManager } from './metadata';
import { ModuleManager } from './module';
import { PluginManager } from './plugin';
import { ProgramManager } from './program';
import { TemplateManager } from './template';

export const defaultModuleManager = new ModuleManager(defaultModuleFolder);
export const defaultProgramManager = new ProgramManager();
export const defaultPluginManager = new PluginManager(defaultPluginDataFolder, defaultProgramManager, defaultModuleManager);
export const defaultMetadataManger = new MetadataManager();
export const defaultTemplateManager = new TemplateManager(defaultProgramManager, defaultModuleManager, defaultMetadataManger);
