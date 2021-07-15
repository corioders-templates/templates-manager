import { Template } from '@/lib/manager/templates/template';

import { Part, createPart } from './part';

export class PartsManager {
	constructor() {}

	createPart(partName: string, template: Template): Promise<Part> {
		return createPart(partName, template);
	}
}
