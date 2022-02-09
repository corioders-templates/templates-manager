import { exec } from '@corioders/nodekit/child_process';
import { exists, mkdir, readJsonFile, symlink } from '@corioders/nodekit/fs';
import { resolve, join } from 'path';

import { packageJson, PackageJson } from '@/lib/constant/file/packageJson';
import { outFolder } from '@/lib/constant/location/location';
import { getCoriodersAttribute, setCoriodersAttribute } from '@/lib/manager/module/attribute';

import { importPathToImportVersion } from '../module/importPath';

/**
 * buildProgram builds program inside importPath, it assumes that importPath is valid program import path.
 */
export async function buildProgram(importPath: string, absoluteProgramPath: string): Promise<void> {
	const { importPathWithoutVersion } = importPathToImportVersion(importPath);

	// Check if we need to build, if nothing has changed there is no reason to rebuild.
	// currentHash is the hash of latest git commit inside importPath repo.
	const currentHash = (await getCoriodersAttribute(importPathWithoutVersion, 'HASH')) ?? 'currentHash';

	// Only if out dir exists there is a reason why we need to check this.
	if (await exists(join(absoluteProgramPath, 'out'))) {
		// buildedHash is last hash that was builded.
		const buildedHash = (await getCoriodersAttribute(importPathWithoutVersion, 'BUILDED_HASH')) ?? 'buildedHash';
		// If currentHash differs from buildedHash that means that we need to rebuild, to get our build hash up to date.
		const shouldBuild = currentHash != buildedHash;
		if (!shouldBuild) return;
	}

	await validateProgram(absoluteProgramPath);

	// Install node_modules, by running yarn install.
	const install = await exec('yarn install', { cwd: absoluteProgramPath });
	if (install.stderr != '') throw new Error(install.stderr);

	// Run the actual build, by running yarn run build
	const build = await exec('yarn run build', { cwd: absoluteProgramPath });
	if (build.stderr != '') throw new Error(build.stderr);

	await createCoriodersSymlink(absoluteProgramPath);

	// Update BUILDED_HASH to current builded hash.
	await setCoriodersAttribute(importPathWithoutVersion, 'BUILDED_HASH', currentHash);
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
		throw new Error(`Plugin is dependent on ${currentProjectName} directly but should be dependent on ${currentProjectName + '-types'}`);
	}
}

/**
 * createCoriodersSymlink, creates symlink inside programs node_modules folder that points to this project.
 * One might ask why just don't 'yarn add <this project name>', the answer is that program must refer to this project directly.
 * Because of that program installs just types of this project (from DefinitelyTyped) and the real implementation is symliked at runtime, this is done via this function.
 */
async function createCoriodersSymlink(absoluteProgramPath: string): Promise<void> {
	const path = resolve(absoluteProgramPath, 'node_modules', packageJson.name + '-types');
	if (await exists(path)) return;

	const realPathSplit = path.split('/');
	const realPath = realPathSplit.slice(0, realPathSplit.length - 1).join('/');
	await mkdir(realPath);
	await symlink(outFolder, path, 'dir');
}
