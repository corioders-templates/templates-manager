import { exec } from '@corioders/nodekit/child_process';
import { exists, mkdir, readJsonFile, symlink } from '@corioders/nodekit/fs';
import { resolve } from 'path';

import { packageJson, PackageJson } from '@/lib/constant/files/packageJson';
import { outFolder } from '@/lib/constant/location/location';
import { getCoriodersAttribute, setCoriodersAttribute } from '@/lib/manager/modules/attributes';

export async function buildProgram(importPath: string, absoluteProgramPath: string): Promise<void> {
	const currentHash = await getCoriodersAttribute(importPath, 'HASH');
	const buildHash = await getCoriodersAttribute(importPath, 'BUILD_HASH');
	const shouldBuild = currentHash != buildHash;
	if (!shouldBuild) return;

	await validateProgram(absoluteProgramPath);

	const install = await exec('yarn install', { cwd: absoluteProgramPath });
	if (install.stderr != '') throw install.stderr;

	const build = await exec('yarn run build', { cwd: absoluteProgramPath });
	if (build.stderr != '') throw build.stderr;

	await createCoriodersSymlink(absoluteProgramPath);
	await setCoriodersAttribute(importPath, 'BUILD_HASH', currentHash);
}

export function getProgramEntry(absoluteProgramPath: string): string {
	return resolve(absoluteProgramPath, 'out', 'index.js');
}

async function validateProgram(absoluteProgramPath: string): Promise<void> {
	const currentProjectName = packageJson.name;
	const programPackageJson = await readJsonFile<PackageJson>(resolve(absoluteProgramPath, 'package.json'));

	if (
		programPackageJson?.dependencies?.[currentProjectName] !== undefined ||
		programPackageJson?.devDependencies?.[currentProjectName] !== undefined ||
		programPackageJson?.peerDependencies?.[currentProjectName] !== undefined
	) {
		// This project is a dependency of plugin which is incorrect.
		throw new Error(`Plugin is dependent on ${currentProjectName} directly but should be dependent on @types/some_meaningful_name`);
	}
}

async function createCoriodersSymlink(absoluteProgramPath: string): Promise<void> {
	const path = resolve(absoluteProgramPath, 'node_modules', packageJson.name);
	if (await exists(path)) return;

	const realPathSplit = path.split('/');
	const realPath = realPathSplit.slice(0, realPathSplit.length - 1).join('/');
	await mkdir(realPath);
	await symlink(outFolder, path, 'dir');
}
