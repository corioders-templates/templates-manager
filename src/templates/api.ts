import { readFile, writeFile } from '@/nodekit/fs';

export class TemplateApi {
	async read(path: string): Promise<string> {
		return await readFile(path, { encoding: 'utf-8' });
	}
	async write(path: string, fileContent: string): Promise<void> {
		await writeFile(path, fileContent, { encoding: 'utf-8' });
	}
	async copy(from: string, to: string): Promise<void> {}
}
