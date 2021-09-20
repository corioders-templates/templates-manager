import { Folder } from '@corioders/nodekit/fs/file';

import { Template } from '@/lib/manager/template/template';

export class Part {
	private name: string;
	private folder: Folder;

	constructor(name: string, folder: Folder) {
		this.name = name;
		this.folder = folder;
	}
}

export async function createPart(partName: string, template: Template): Promise<Part> {
	const folder = await template.executeTemplate();

	const part = new Part(partName, folder);
	return part;
}
