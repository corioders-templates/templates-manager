export interface Config {}
export interface cliApi {
	choose(question: string, choices: string[], defaultValue: undefined | string | string[] | boolean): Promise<string>;
	check(question: string, choices: string[], defaultValue: undefined | string | string[] | boolean): Promise<string[]>;
	confirm(question: string, defaultValue: undefined | string | string[] | boolean): Promise<boolean>;
	input(question: string, defaultValue: undefined | string, validate: undefined | (() => Promise<string | boolean>)): Promise<string>;
	password(question: string): Promise<string>;
}
