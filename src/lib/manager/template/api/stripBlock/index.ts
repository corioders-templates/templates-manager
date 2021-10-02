import { File } from '@corioders/nodekit/fs/file';

import { Evaluator } from './evaluator';
import parseStripBlocks from './parser';

export default async function applyStripBlocks(stripBlockGlobalObject: Record<string, unknown>, files: File[]): Promise<void> {
	const evaluator = new Evaluator(stripBlockGlobalObject);
	const applyPromises = [];
	for (const file of files) {
		applyPromises.push(applyStripBlocksToFile(evaluator, file));
	}
	await Promise.all(applyPromises);
}

async function applyStripBlocksToFile(evaluator: Evaluator, file: File): Promise<void> {
	const content = file.getContentString();
	const contentLines = content.split('\n');
	const stripBlocks = parseStripBlocks(contentLines);

	// TODO(@watjurk): optimize the following part of this function by dynamically evaluating expressions based on how stripBlocks effect one another:
	// strip:start sb1 false
	// strip:start sb2 true
	// strip:end sb2
	// strip:end sb1
	// no need to evaluate expression for sb2, as it will be deleted because of sb1.

	// Evaluate all expressions.
	const evaluatorPromises = [];
	for (const stripBlock of stripBlocks) {
		evaluatorPromises.push(
			(async (): Promise<void> => {
				stripBlock.evaluatedExpression = await evaluator.evaluate(stripBlock.expression);
			})(),
		);
	}
	await Promise.all(evaluatorPromises);

	// Strip blocks where evaluatedExpression is false.
	for (const stripBlock of stripBlocks) {
		// Remove the strip:start and strip:end.
		contentLines[stripBlock.startLine] = '';
		contentLines[stripBlock.endLine] = '';

		if (stripBlock.evaluatedExpression === false) {
			// Remove contents between strip:start and strip:end.
			for (let i = stripBlock.startLine + 1; i < stripBlock.endLine; i++) contentLines[i] = '';
		}
	}

	file.setContentString(contentLines.join('\n'));
}
