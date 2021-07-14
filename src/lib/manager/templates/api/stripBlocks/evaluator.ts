// notStrictContextEval is function that executes code in provided scope.
// Unfortunately this needs to be done like this, to cheat strict mode.
const notStrictContextEval = new Function(
	'scope',
	`
	for (const key of Object.keys(scope)) {
		eval(\`var \${key} = scope['\${key}']\`);
	}

	return async function(code) {
		eval(\`async function evalFunc() { return await \${code} };\`);
		return await evalFunc()
	} 
	`,
);

export class Evaluator {
	private evaluator: (code: string) => Promise<unknown>;
	constructor(scope: Record<string, unknown>) {
		this.evaluator = notStrictContextEval(scope) as (code: string) => Promise<unknown>;
	}

	async evaluate(code: string): Promise<boolean> {
		const ret = await this.evaluator(code);
		if (typeof ret !== 'boolean') throw new Error('Evaluated code must resolve to boolean.');
		return ret;
	}
}
