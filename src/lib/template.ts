import { Folder } from '@corioders/nodekit/fs/file';

import { defaultTemplateManager } from '@/lib/manager';

export async function create(templateImportPath: string): Promise<Folder> {
	const template = await defaultTemplateManager.importPathToTemplate(templateImportPath);
	const templateFolder = await template.executeTemplate();
	return templateFolder;
}
