export class StripBlock {
	readonly name: string;

	expression: string;
	evaluatedExpression: boolean;
	startLine: number;
	endLine: number;

	constructor(name: string) {
		this.name = name;
	}

	/**
	 * isComplete reports whenever stripBlock has all required values (startLine, endLine, expression)
	 */
	isComplete(): boolean {
		return this.startLine !== undefined && this.endLine !== undefined && this.expression !== undefined;
	}
}

export class StripBlockStore {
	private map: Map<string, StripBlock>;
	constructor() {
		this.map = new Map<string, StripBlock>();
	}

	set(stripBlock: StripBlock): void {
		if (this.map.has(stripBlock.name)) {
			throw new Error(`Duplicate StripBlock name`);
		}
		this.map.set(stripBlock.name, stripBlock);
	}

	getByName(stripBlockName: string): StripBlock | undefined {
		return this.map.get(stripBlockName);
	}

	delete(stripBlock: StripBlock): void {
		this.map.delete(stripBlock.name);
	}

	getAll(): StripBlock[] {
		return Array.from(this.map.values());
	}
}
