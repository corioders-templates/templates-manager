import { Storage } from '@corioders/nodekit/storage';
import axios, { AxiosError } from 'axios';

import Provider from './provider';

export default class GithubProvider extends Provider {
	constructor(storage: Storage) {
		super(storage);
	}

	async createRepo(repoName: string, organizationName: string = ''): Promise<string> {
		if (organizationName === '') {
			return await createUserRepo(await this.loadToken(), repoName);
		}

		return await createOrganizationRepo(await this.loadToken(), repoName, organizationName);
	}

	async listOrganizations(): Promise<string[]> {
		return listOrganizations(await this.loadToken());
	}

	async login(token: string): Promise<void> {
		await this.saveToken(token);
	}

	async signOut(): Promise<void> {
		await this.removeToken();
	}

	async isLoggedIn(): Promise<boolean> {
		const token = await this.loadToken();
		return token != '';
	}
}

type githubListOrganizationsResponse = { login: string }[];

async function listOrganizations(token: string): Promise<string[]> {
	try {
		const url = 'https://api.github.com/user/orgs';
		const response = await axios.get(url, { headers: { Authorization: `token ${token}` } });
		const data = response.data as githubListOrganizationsResponse;

		return data.map((org) => org.login);
	} catch (err: unknown) {
		const error = err as AxiosError;
		throw formatGithubError(error.response?.data as githubError);
	}
}

interface githubCreateRepoResponse {
	html_url: string;
}

async function createOrganizationRepo(token: string, repoName: string, organizationName: string): Promise<string> {
	try {
		const url = `https://api.github.com/orgs/${organizationName}/repos`;
		const response = await axios.post(url, { name: repoName }, { headers: { Authorization: `token ${token}` } });

		const data = response.data as githubCreateRepoResponse;
		return data.html_url;
	} catch (err: unknown) {
		const error = err as AxiosError;
		throw formatGithubError(error.response?.data as githubError);
	}
}

async function createUserRepo(token: string, repoName: string): Promise<string> {
	try {
		const url = 'https://api.github.com/user/repos';
		const response = await axios.post(url, { name: repoName }, { headers: { Authorization: `token ${token}` } });

		const data = response.data as githubCreateRepoResponse;
		return data.html_url;
	} catch (err: unknown) {
		const error = err as AxiosError;
		throw formatGithubError(error.response?.data as githubError);
	}
}

interface githubError {
	message: string;
	errors: { message: string }[];
}

function formatGithubError(error: githubError): Error {
	let errorMessage = error.message;
	for (const err of error.errors) errorMessage += ` ${err.message}`;
	return new Error(errorMessage);
}
