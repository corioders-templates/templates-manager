import { Folder } from '@corioders/nodekit/fs/file';

import { Template } from '@/lib/manager/templates/template';
import { GlobalPluginsObject } from '@/plugins/global';

export class Part {
	private name: string;
	private folder: Folder;

	constructor(name: string, folder: Folder) {
		this.name = name;
		this.folder = folder;
	}
}

export async function createPart(partName: string, template: Template, globalPluginsObject: GlobalPluginsObject): Promise<Part> {
	const folder = await template.executeTemplate(globalPluginsObject);

	const part = new Part(partName, folder);
	return part;
}
