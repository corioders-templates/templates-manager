import { create, remove } from './project';

export class ProjectManager {
	constructor(projectStoragePath: string, pathJsonFilename: string) {
		this.initPaths(projectStoragePath, pathJsonFilename);
	}
	private projectStoragePath: string;
	private pathJsonFilename: string;
	private initPaths(projectStoragePath: string, pathJsonFilename: string): void {
		this.projectStoragePath = projectStoragePath;
		this.pathJsonFilename = pathJsonFilename;
	}
	async createProject(name: string, url: string): Promise<void> {
		await create(name, url, this.projectStoragePath, this.pathJsonFilename);
	}
	async removeProject(name: string): Promise<void> {
		await remove(name, this.projectStoragePath);
	}
}
