import { exec } from '@corioders/nodekit/child_process';
import { exists, mkdir, readJsonFile, symlink } from '@corioders/nodekit/fs';
import { resolve } from 'path';

import { packageJson, PackageJson } from '@/lib/constant/files/packageJson';
import { outFolder } from '@/lib/constant/location/location';
import { getCoriodersAttribute, setCoriodersAttribute } from '@/lib/manager/modules/attributes';

/**
 * buildProgram builds program inside importPath, it assumes that importPath is valid program import path.
 */
export async function buildProgram(importPath: string, absoluteProgramPath: string): Promise<void> {
	// Check if we need to build, if nothing has changed there is no reason to rebuild.
	// currentHash is the hash of latest git commit inside importPath repo.
	const currentHash = await getCoriodersAttribute(importPath, 'HASH');
	// buildedHash is last hash that was builded.
	const buildedHash = await getCoriodersAttribute(importPath, 'BUILDED_HASH');
	// If currentHash differs from buildedHash that means that we need to rebuild, to get our build hash up to date.
	const shouldBuild = currentHash != buildedHash;
	if (!shouldBuild) return;

	await validateProgram(absoluteProgramPath);

	// Install node_modules, by running yarn install.
	const install = await exec('yarn install', { cwd: absoluteProgramPath });
	if (install.stderr != '') throw new Error(install.stderr);

	// Run the actual build, by running yarn run build
	const build = await exec('yarn run build', { cwd: absoluteProgramPath });
	if (build.stderr != '') throw new Error(build.stderr);

	await createCoriodersSymlink(absoluteProgramPath);

	// Update BUILDED_HASH to current builded hash.
	await setCoriodersAttribute(importPath, 'BUILDED_HASH', currentHash);
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
		// This project is a dependency of plugin which is incorrect, see createCoriodersSymlink.
		throw new Error(`Plugin is dependent on ${currentProjectName} directly but should be dependent on @types/some_meaningful_name`);
	}
}

/**
 * createCoriodersSymlink, creates symlink inside programs node_modules folder that points to this project.
 * One might ask why just don't 'yarn add <this project name>', the answer is that program must refer to this project directly.
 * Because of that program installs just types of this project (from DefinitelyTyped) and the real implementation is symliked at runtime, this is done via this function.
 */
async function createCoriodersSymlink(absoluteProgramPath: string): Promise<void> {
	const path = resolve(absoluteProgramPath, 'node_modules', packageJson.name);
	if (await exists(path)) return;

	const realPathSplit = path.split('/');
	const realPath = realPathSplit.slice(0, realPathSplit.length - 1).join('/');
	await mkdir(realPath);
	await symlink(outFolder, path, 'dir');
}
