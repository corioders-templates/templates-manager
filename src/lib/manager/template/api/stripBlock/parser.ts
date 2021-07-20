import { StripBlock, StripBlockStore } from './stripBlock';

enum Keywords {
	stripStart,
	stripEnd,
}

interface Keyword {
	WORD: string;
	ID: Keywords;
}

const keywords: Keyword[] = [
	{
		ID: Keywords.stripStart,
		WORD: 'strip:start',
	},
	{
		ID: Keywords.stripEnd,
		WORD: 'strip:end',
	},
];

type Parser = (state: State, line: string, lineIndex: number) => void;

const parsers: Map<Keywords, Parser> = new Map<Keywords, Parser>([
	[Keywords.stripStart, parseStripBlockStart],
	[Keywords.stripEnd, parseStripBlockEnd],
]);

interface State {
	usedName: Set<string>;
	stripBlock: StripBlockStore;
}

export default function parseStripBlock(sourceLine: string[]): StripBlock[] {
	// Internal state of the parser.
	const state: State = {
		usedName: new Set<string>(),
		stripBlock: new StripBlockStore(),
	};

	for (let lineIndex = 0; lineIndex < sourceLine.length; lineIndex++) {
		const line = sourceLine[lineIndex];
		for (const keyword of keywords) {
			const parser = parsers.get(keyword.ID);
			if (parser === undefined) {
				throw new Error(`No parser defined for keyword with WORD: ${keyword.WORD} and ID: ${keyword.ID}.`);
			}

			const nextIndex = findKeyword(line, keyword);
			if (nextIndex === -1) {
				continue;
			}

			parser(state, line.substring(nextIndex), lineIndex);
		}
	}

	const stripBlocks = state.stripBlock.getAll();
	for (const stripBlock of stripBlocks) {
		if (!stripBlock.isComplete()) {
			throw new Error(`Got incomplete stripBlock, did you forget to add "strip:end ${stripBlock.name}"? strip:start seen on line: ${stripBlock.startLine}`);
		}
	}

	// Find overlapping stripBlocks:
	// 1. strip:start sb1 true
	// 2. strip:start sb2 true
	// 3. strip:end sb1
	// 4. strip:end sb2

	// sb1 and sb2 are overlapping, when sb1 is removed sb2 structure is not complete and vice versa.
	// We can detect such issue by checking if strip blocks close in exactly reverse order as they opened, if so then no overlapping occurs.

	const lineIndexToStripBlockMap = new Map<number, StripBlock>();
	for (const stripBlock of stripBlocks) {
		lineIndexToStripBlockMap.set(stripBlock.startLine, stripBlock);
		lineIndexToStripBlockMap.set(stripBlock.endLine, stripBlock);
	}

	const sortedLineIndex = [...lineIndexToStripBlockMap.keys()].sort();
	const closeOrder: StripBlock[] = [];
	for (const lineIndex of sortedLineIndex) {
		const stripBlock = lineIndexToStripBlockMap.get(lineIndex) as StripBlock;
		// If stripBlock.startLine === lineIndex this means that stripBlock is opening at lineIndex.
		if (stripBlock.startLine === lineIndex) {
			closeOrder.push(stripBlock);
		}

		// If stripBlock.endLine === lineIndex this means that stripBlock is closing at lineIndex.
		if (stripBlock.endLine === lineIndex) {
			const poppedStripBlock = closeOrder.pop();
			if (poppedStripBlock === undefined) {
				throw new Error(`poppedStripBlock should never be undefined, unexpected!`);
			}

			// If expected close order is different from actual then we know that overlapping is happening.
			if (poppedStripBlock !== stripBlock) {
				throw new Error(
					`StripBlock starting at line: ${stripBlock.startLine} and ending at line: ${stripBlock.endLine} is overlapping with strip block starting at line: ${poppedStripBlock.startLine} and ending at line: ${poppedStripBlock.endLine}`,
				);
			}
		}
	}

	return stripBlocks;
}

/**
 * findKeyword expects keywords in spec:
 * " KEY_WORD "
 */
function findKeyword(line: string, keyword: Keyword): number {
	const keywordIndex = line.indexOf(keyword.WORD);
	// Check if keyword was found.
	if (keywordIndex === -1) return -1;

	// Check if keyword has space in the front.
	if (line[keywordIndex - 1] !== ' ') return -1;

	// Check if keyword has space at the back.
	if (line[keywordIndex + keyword.WORD.length] !== ' ') return -1;

	// Return index of first not whitespace character.
	return keywordIndex + keyword.WORD.length + 1;
}

function parseStripBlockStart(state: State, line: string, lineIndex: number): void {
	const nameEndSpaceIndex = line.indexOf(' ');
	const name = line.substring(0, nameEndSpaceIndex);
	if (name === '') {
		// When line is empty no name nor expression was provided
		if (line === '') {
			throw new Error(`No name provided after "strip:start" on line: ${lineIndex}`);
		}

		const name = line;
		throw new Error(`No expression provided after "strip:start ${name}" on line: ${lineIndex}`);
	}

	if (state.usedName.has(name)) {
		throw new Error(`Duplicate strip-block name: ${name}`);
	}
	state.usedName.add(name);

	// Expression is right after name, +1 is for skipping the leading space.
	const expression = line.substring(nameEndSpaceIndex + 1);
	if (expression === '') {
		throw new Error(`No expression provided after name in "strip:start ${name}" on line: ${lineIndex}`);
	}

	const stripBlock = new StripBlock(name);

	stripBlock.expression = expression;
	stripBlock.startLine = lineIndex;
	state.stripBlock.set(stripBlock);
}

function parseStripBlockEnd(state: State, line: string, lineIndex: number): void {
	// stripBlock name is right after strip:end keyword
	const name = line;
	const stripBlock = state.stripBlock.getByName(name);
	if (stripBlock === undefined) {
		throw new Error(`No strip:start was defined for strip-block with name: ${name}`);
	}

	stripBlock.endLine = lineIndex;
}
