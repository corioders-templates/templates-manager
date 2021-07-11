import { buildProgram, getProgramEntry } from './build';

/**
 * ProgramManager manages common things between plugins and templates manager
 */
export class ProgramManager {
	async buildProgram(importPath: string, absolutePluginPath: string): Promise<void> {
		await buildProgram(importPath, absolutePluginPath);
	}
	getProgramEntry(absoluteProgramPath: string): string {
		return getProgramEntry(absoluteProgramPath);
	}
}
