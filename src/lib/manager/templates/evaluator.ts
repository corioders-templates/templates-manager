// notStrictContextEval is function that executes code in provided scope.
// Unfortunately this needs to be done like this, to cheat strict mode.
const notStrictContextEval = new Function(
	'scope',
	'code',
	`
	const keys = Object.keys(scope);
	for (const key of keys) {
		eval(\`var \${key} = scope['\${key}']\`);
	}

	return eval(code);
	`,
);

export default function (scope: Record<string, unknown>, code: string): boolean {
	const codeRet: unknown = notStrictContextEval(scope, code);

	if (typeof codeRet !== 'boolean') throw new Error('Evaluated code must resolve to boolean.');
	return codeRet;
}
