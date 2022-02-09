
import { Folder } from '@corioders/nodekit/fs/file';

import { defaultTemplateManager, defaultPluginManager } from '@/lib/manager';

export async function create(templateImportPath: string): Promise<Folder> {
	const template = await defaultTemplateManager.importPathToTemplate(templateImportPath);
	const templateFolder = await template.executeTemplate(defaultPluginManager.globalPluginObject);
	return templateFolder;
}

// TODO: introduce .corioders to inform us where root of the project is.
// update must be invoked from root of the project folder, so that fileFolderPath is relative to project root.
export async function update(fileFolderPath: string): Promise<void> {
	await defaultTemplateManager.updateTemplate( fileFolderPath);
}
