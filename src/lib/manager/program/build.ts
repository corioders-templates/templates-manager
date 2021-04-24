import { resolve } from 'path';

import { packageJson, PackageJson } from '@/lib/constant/files/packageJson';
import { getCoriodersAttribute, setCoriodersAttribute } from '@/lib/manager/modules/attributes';
import { exec } from '@/nodekit/child_process';
import { readJsonFile } from '@/nodekit/fs';

export async function buildProgram(importPath: string, absoluteProgramPath: string): Promise<void> {
	await validateProgram(absoluteProgramPath);
	const currentHash = await getCoriodersAttribute(importPath, 'HASH');
	const buildHash = await getCoriodersAttribute(importPath, 'BUILD_HASH');
	const shouldBuild = currentHash != buildHash;
	if (!shouldBuild) return;

	const install = await exec('yarn install', { cwd: absoluteProgramPath });
	if (install.stderr != '') throw install.stderr;

	const build = await exec('yarn run build', { cwd: absoluteProgramPath });
	if (build.stderr != '') throw build.stderr;

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
