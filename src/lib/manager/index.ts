import { defaultModulesFolder } from '@/lib/constant/location/modules';

import { ModulesManager } from './modules';

export const defaultModulesManager = new ModulesManager(defaultModulesFolder);
