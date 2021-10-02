import { Folder } from '@corioders/nodekit/fs/file';

import { defaultTemplateManager, defaultPluginManager } from '@/lib/manager';

export async function create(templateImportPath: string): Promise<Folder> {
	const template = await defaultTemplateManager.importPathToTemplate(templateImportPath);
	const templateFolder = await template.executeTemplate(defaultPluginManager.globalPluginObject);
	return templateFolder;
}
