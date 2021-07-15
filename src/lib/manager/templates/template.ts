import { Folder } from '@corioders/nodekit/fs/file';
import { resolve } from 'path';

import { CliInterface } from '@/cli/api';
import { ModulesManager } from '@/lib/manager/modules';
import { ProgramManager } from '@/lib/manager/program';
import { GlobalPluginsObject } from '@/plugins/global';
import { templatesApi } from '@/templates';

import { TemplatesApi } from './api';

export class Template {
	private templateFolderPath: string;
	private templateFolderPromise: Promise<Folder>;

	private templateFunction: TemplateFunction;

	constructor(absoluteTemplatePath: string, templateFunction: TemplateFunction) {
		this.templateFolderPath = resolve(absoluteTemplatePath, 'template');
		this.templateFunction = templateFunction;

		this.templateFolderPromise = Folder.fromFolderPath(this.templateFolderPath);
	}

	async executeTemplate(globalPluginsObject: GlobalPluginsObject): Promise<Folder> {
		const templateFolder = await this.templateFolderPromise;

		const tfo: TemplateFunctionObject = {
			templatesApi: new TemplatesApi(templateFolder, globalPluginsObject),
			cliApi: globalPluginsObject['cli-api'],
		};

		await this.templateFunction(tfo);

		return templateFolder;
	}
}

export interface TemplateFunctionObject {
	templatesApi: templatesApi;
	cliApi: CliInterface;
}

export type TemplateFunction = (tfo: TemplateFunctionObject) => Promise<void>;

export async function importPathToTemplate(importPath: string, programManager: ProgramManager, modulesManager: ModulesManager): Promise<Template> {
	// Find and 'link' template function.
	const absoluteTemplatePath = await modulesManager.importPathToAbsolute(importPath);
	await programManager.buildProgram(importPath, absoluteTemplatePath);
	const module = (await import(programManager.getProgramEntry(absoluteTemplatePath))) as { default?: unknown };
	const templateFunction = module.default;

	if (templateFunction === undefined) throw new Error('Template function must have a default export');
	if (!isTemplateFunction(templateFunction)) throw new Error('Template function must have a default export, that takes TemplateFunctionObject as first parameter');

	const template = new Template(absoluteTemplatePath, templateFunction);
	return template;
}

function isTemplateFunction(x: unknown): x is TemplateFunction {
	if (typeof x !== 'function') return false;

	// Check if number of arguments equals 1.
	if (x.length !== 1) return false;

	return true;
}
