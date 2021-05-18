import { prompt } from 'inquirer';

export interface Config {}

interface cliApi {
	choose(question: string, choices: string[], defaultValue: undefined | string | string[] | boolean): Promise<string>;
	check(question: string, choices: string[], defaultValue: undefined | string | string[] | boolean): Promise<string[]>;
	confirm(question: string, defaultValue: undefined | string | string[] | boolean): Promise<boolean>;
	input(question: string, defaultValue: undefined | string, validate: undefined | (() => Promise<string | boolean>)): Promise<string>;
	password(question: string): Promise<string>;
}

const api: cliApi = {
	async choose(question, choices, defaultValue) {
		const val = await prompt({ name: question, type: 'list', choices, default: defaultValue });
		return val[question] as string;
	},
	async check(question, choices, defaultValue) {
		const val = await prompt({ name: question, type: 'checkbox', choices, default: defaultValue });
		return val[question] as string[];
	},
	async confirm(question, defaultValue) {
		const val = await prompt({ name: question, type: 'confirm', default: defaultValue });
		return val[question] as boolean;
	},
	async input(question, defaultValue = undefined, validate = undefined) {
		const val = await prompt({ name: question, type: 'input', default: defaultValue, validate });
		return val[question] as string;
	},
	async password(question) {
		const val = await prompt({ name: question, type: 'password' });
		return val[question] as string;
	},
};

export default api;
