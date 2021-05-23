import { create, remove } from './project';

export class CoriodersManager {
	constructor(projectsStoragePath: string, pathsJsonFilename: string) {
		this.initPaths(projectsStoragePath, pathsJsonFilename);
	}
	private projectsStoragePath: string;
	private pathsJsonFilename: string;
	private initPaths(projectsStoragePath: string, pathsJsonFilename: string): void {
		this.projectsStoragePath = projectsStoragePath;
		this.pathsJsonFilename = pathsJsonFilename;
	}
	async createProject(name: string, url: string): Promise<void> {
		await create(name, url, this.projectsStoragePath, this.pathsJsonFilename);
	}
	async removeProject(name: string): Promise<void> {
		await remove(name, this.projectsStoragePath);
	}
}
