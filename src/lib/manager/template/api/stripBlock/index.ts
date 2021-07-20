import { File } from '@corioders/nodekit/fs/file';

import { Evaluator } from './evaluator';
import parseStripBlock from './parser';

export default async function applyStripBlock(stripBlockGlobalObject: Record<string, unknown>, files: File[]): Promise<void> {
	const evaluator = new Evaluator(stripBlockGlobalObject);
	const applyPromise = [];
	for (const file of files) {
		applyPromise.push(applyStripBlockToFile(evaluator, file));
	}
	await Promise.all(applyPromise);
}

async function applyStripBlockToFile(evaluator: Evaluator, file: File): Promise<void> {
	const content = file.getContentString();
	const contentLine = content.split('\n');
	const stripBlocks = parseStripBlock(contentLine);

	// TODO(@watjurk): optimize the following part of this function by dynamically evaluating expressions based on how stripBlocks effect one another:
	// strip:start sb1 false
	// strip:start sb2 true
	// strip:end sb2
	// strip:end sb1
	// no need to evaluate expression for sb2, as it will be deleted because of sb1.

	// Evaluate all expressions.
	const evaluatorPromise = [];
	for (const stripBlock of stripBlocks) {
		evaluatorPromise.push(
			(async (): Promise<void> => {
				stripBlock.evaluatedExpression = await evaluator.evaluate(stripBlock.expression);
			})(),
		);
	}
	await Promise.all(evaluatorPromise);

	// Strip blocks where evaluatedExpression is false.
	for (const stripBlock of stripBlocks) {
		// Remove the strip:start and strip:end.
		contentLine[stripBlock.startLine] = '';
		contentLine[stripBlock.endLine] = '';

		if (stripBlock.evaluatedExpression === false) {
			// Remove contents between strip:start and strip:end.
			for (let i = stripBlock.startLine + 1; i < stripBlock.endLine; i++) contentLine[i] = '';
		}
	}

	file.setContentString(contentLine.join('\n'));
}
