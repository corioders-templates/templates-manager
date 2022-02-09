import { TemplateManager } from '.';
import { exists, lstat, mkdir, readdir, writeFile } from '@corioders/nodekit/fs';
import { Folder } from '@corioders/nodekit/fs/file';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { join, resolve, relative } from 'path';

import { cliApi } from '@/cli/api';
import { MetadataManager } from '@/lib/manager/metadata';
import { ModuleManager } from '@/lib/manager/module';
import { PluginManager } from '@/lib/manager/plugin';
import { ProgramManager } from '@/lib/manager/program';
import { GlobalPluginObject } from '@/plugin/global';
import { templateApi } from '@/template';

import { TemplateApi } from './api';

export class Template {
	private importPath: string;

	private metadataManager: MetadataManager;
	private moduleManager: ModuleManager;

	private templateFolderPath: string;
	private templateFolderPromise: Promise<Folder>;

	private templateFunction: TemplateFunction;

	constructor(absoluteTemplatePath: string, importPath: string, templateFunction: TemplateFunction, moduleManager: ModuleManager, metadataManager: MetadataManager) {
		this.importPath = importPath;

		this.moduleManager = moduleManager;
		this.metadataManager = metadataManager;

		this.templateFolderPath = resolve(absoluteTemplatePath, 'template');
		this.templateFunction = templateFunction;

		this.templateFolderPromise = Folder.fromFolderPath(this.templateFolderPath);
	}

	async executeTemplate(globalPluginsObject: GlobalPluginObject): Promise<Folder> {
		const templateFolder = await this.templateFolderPromise;

		const tfo: TemplateFunctionObject = {
			templateApi: new TemplateApi(templateFolder, globalPluginsObject),
			cliApi: globalPluginsObject['cli-api'],
		};

		await this.templateFunction(tfo);

		this.metadataManager.initMetadata(templateFolder, {
			version: await this.moduleManager.importPathToModuleVersion(this.importPath),
			importPath: this.importPath,
		});
		return templateFolder;
	}
}

export interface TemplateFunctionObject {
	templateApi: templateApi;
	cliApi: cliApi;
}

export type TemplateFunction = (tfo: TemplateFunctionObject) => Promise<void>;

export async function importPathToTemplate(
	importPath: string,
	programManager: ProgramManager,
	moduleManager: ModuleManager,
	metadataManager: MetadataManager,
): Promise<Template> {
	// Find and 'link' template function.
	const absoluteTemplatePath = await moduleManager.importPathToAbsolute(importPath);
	await programManager.buildProgram(importPath, absoluteTemplatePath);
	const module = (await import(programManager.getProgramEntry(absoluteTemplatePath))) as { default?: unknown };
	const templateFunction = module.default;

	if (templateFunction === undefined) throw new Error('Template function must have a default export');
	if (!isTemplateFunction(templateFunction)) throw new Error('Template function must have a default export, that takes TemplateFunctionObject as first parameter');

	const template = new Template(absoluteTemplatePath, importPath, templateFunction, moduleManager, metadataManager);
	return template;
}

function isTemplateFunction(x: unknown): x is TemplateFunction {
	if (typeof x !== 'function') return false;

	// Check if number of arguments equals 1.
	if (x.length !== 1) return false;

	return true;
}

export async function updateTemplate(
	absoluteFileFolderPath: string,
	templateManager: TemplateManager,
	moduleManager: ModuleManager,
	pluginManager: PluginManager,
	metadataManager: MetadataManager,
): Promise<void> {
	const lastVersionUsed = (await metadataManager.getMetadata('version')) as string | null;
	if (lastVersionUsed === null) throw new Error('No version in .corioders file.');

	const importPath = (await metadataManager.getMetadata('importPath')) as string | null;
	if (importPath === null) throw new Error('No importPath in .corioders file.');
	const { importPathWithoutVersion } = moduleManager.importPathToImportVersion(importPath);

	const importPathWithLastVersion = `${importPathWithoutVersion}@${lastVersionUsed}`;
	const updatedImportPath = importPathWithoutVersion;

	const lastTemplate = await templateManager.importPathToTemplate(importPathWithLastVersion);
	const updatedTemplate = await templateManager.importPathToTemplate(updatedImportPath);

	const tmpDir = tmpdir();

	const emptyFilePath = join(tmpDir, 'emptyFile');
	await writeFile(emptyFilePath, '');

	const lastProjectRootPath = join(tmpDir, 'last');
	await mkdir(lastProjectRootPath);

	const updatedProjectRootPath = join(tmpDir, 'updated');
	await mkdir(updatedProjectRootPath);

	// TODO: this version has the same parameter as the one used by user, so we should save user's last input
	const lastTemplateFolder = await lastTemplate.executeTemplate(pluginManager.globalPluginObject);

	// TODO: how to handle template parameters? template version is different so parameters are different also.
	const updatedTemplateFolder = await updatedTemplate.executeTemplate(pluginManager.globalPluginObject);

	await lastTemplateFolder.save(lastProjectRootPath);
	await updatedTemplateFolder.save(updatedProjectRootPath);

	const projectRootPath = await MetadataManager.getProjectRootPath();
	if (projectRootPath === null) throw new Error('No project root was found.');

	const fileFolderPath = relative(projectRootPath, absoluteFileFolderPath);

	const projectFileFolderPath = resolve(projectRootPath, fileFolderPath);
	const lastFileFolderPath = resolve(lastProjectRootPath, fileFolderPath);
	const updatedFileFolderPath = resolve(updatedProjectRootPath, fileFolderPath);

	if ((await lstat(projectFileFolderPath)).isFile()) await gitMergeFile(projectFileFolderPath, lastFileFolderPath, updatedFileFolderPath, emptyFilePath);
	else await gitMergeFolder(projectFileFolderPath, lastFileFolderPath, updatedFileFolderPath, emptyFilePath);

	const updatedVersion = await moduleManager.importPathToModuleVersion(updatedImportPath);
	await metadataManager.setMetadata('version', updatedVersion);
}

async function gitMergeFolder(currentFolder: string, baseFolder: string, otherFolder: string, emptyFile: string): Promise<void> {
	const runner = async (currentFolder: string, baseFolder: string, otherFolder: string): Promise<void> => {
		const gitPromises = [];

		const currentFolderNames = await readdir(currentFolder);
		const otherFolderNames = await readdir(otherFolder);
		const folderNames = new Set([...currentFolderNames, ...otherFolderNames]);
		for (const fileOrFolderName of folderNames) {
			const currentFileOrFolderPath = join(currentFolder, fileOrFolderName);
			const baseFileOrFolderPath = join(baseFolder, fileOrFolderName);
			const otherFileOrFolderPath = join(otherFolder, fileOrFolderName);

			let isFile: boolean;
			if (await exists(currentFileOrFolderPath)) {
				isFile = (await lstat(currentFileOrFolderPath)).isFile();
			} else {
				isFile = (await lstat(otherFileOrFolderPath)).isFile();

				if (isFile) await writeFile(currentFileOrFolderPath, '');
				else await mkdir(currentFileOrFolderPath);
			}

			if (isFile) gitPromises.push(gitMergeFile(currentFileOrFolderPath, baseFileOrFolderPath, otherFileOrFolderPath, emptyFile));
			else gitPromises.push(runner(currentFileOrFolderPath, baseFileOrFolderPath, otherFileOrFolderPath));
		}

		await Promise.all(gitPromises);
	};

	await runner(currentFolder, baseFolder, otherFolder);
}

// git merge-file incorporates all changes that lead from the <base-file> to <other-file> into <current-file>.
// The result ordinarily goes into <current-file>
async function gitMergeFile(currentFile: string, baseFile: string, otherFile: string, emptyFile: string): Promise<void> {
	if (!(await exists(baseFile))) baseFile = emptyFile;
	if (!(await exists(otherFile))) otherFile = emptyFile;

	await new Promise<void>((resolve, reject) => {
		const git = spawn('git', ['merge-file', currentFile, baseFile, otherFile], { stdio: 'inherit' });
		git.on('close', (code) => {
			if (code !== 0) reject();
			else resolve();
		});
	});
}
