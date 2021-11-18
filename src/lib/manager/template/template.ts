import { Folder } from '@corioders/nodekit/fs/file';
import { resolve } from 'path';

import { cliApi } from '@/cli/api';
import { ModuleManager } from '@/lib/manager/module';
import { ProgramManager } from '@/lib/manager/program';
import { GlobalPluginObject } from '@/plugin/global';
import { templateApi } from '@/template';

import { TemplateApi } from './api';

export class Template {
	private templateFolderPath: string;
	private templateFolderPromise: Promise<Folder>;

	private templateFunction: TemplateFunction;

	constructor(absoluteTemplatePath: string, templateFunction: TemplateFunction) {
		this.templateFolderPath = resolve(absoluteTemplatePath, 'template');
		this.templateFunction = templateFunction;

		this.templateFolderPromise = Folder.fromFolderPath(this.templateFolderPath);
	}

	async executeTemplate(globalPluginsObject: GlobalPluginObject): Promise<Folder> {
		const templateFolder = await this.templateFolderPromise;

		const tfo: TemplateFunctionObject = {
			templateApi: new TemplateApi(templateFolder, globalPluginsObject),
			CliApi: globalPluginsObject['cli-api'],
		};

		await this.templateFunction(tfo);

		return templateFolder;
	}
}

export interface TemplateFunctionObject {
	templateApi: templateApi;
	CliApi: cliApi;
}

export type TemplateFunction = (tfo: TemplateFunctionObject) => Promise<void>;

export async function importPathToTemplate(importPath: string, programManager: ProgramManager, moduleManager: ModuleManager): Promise<Template> {
	// Find and 'link' template function.
	const absoluteTemplatePath = await moduleManager.importPathToAbsolute(importPath);
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
