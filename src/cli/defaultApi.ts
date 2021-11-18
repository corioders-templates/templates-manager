import { prompt } from 'inquirer';

import { cliApi } from './api';

export class CliApi implements cliApi {
	async choose(question: string, choices: string[], defaultValue: undefined | string | string[] | boolean): Promise<string> {
		const val = await prompt({ name: question, type: 'list', choices, default: defaultValue });
		return val[question] as string;
	}
	async check(question: string, choices: string[], defaultValue: undefined | string | string[] | boolean): Promise<string[]> {
		const val = await prompt({ name: question, type: 'checkbox', choices, default: defaultValue });
		return val[question] as string[];
	}
	async confirm(question: string, defaultValue: undefined | string | string[] | boolean): Promise<boolean> {
		const val = await prompt({ name: question, type: 'confirm', default: defaultValue });
		return val[question] as boolean;
	}
	async input(question: string, defaultValue: undefined | string, validate: undefined | (() => Promise<string | boolean>)): Promise<string> {
		const val = await prompt({ name: question, type: 'input', default: defaultValue, validate });
		return val[question] as string;
	}
	async password(question: string): Promise<string> {
		const val = await prompt({ name: question, type: 'password' });
		return val[question] as string;
	}
}
