import { Template } from '@/lib/manager/template/template';

import { Part, createPart } from './part';

export class PartManager {
	constructor() {}

	createPart(partName: string, template: Template): Promise<Part> {
		return createPart(partName, template);
	}
}
