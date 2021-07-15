import { Template } from '@/lib/manager/templates/template';
import { GlobalPluginsObject } from '@/plugins/global';

import { Part, createPart } from './part';

export class PartsManager {
	constructor() {}

	createPart(partName: string, template: Template, globalPluginsObject: GlobalPluginsObject): Promise<Part> {
		return createPart(partName, template, globalPluginsObject);
	}
}
