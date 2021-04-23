export interface Provider {
	/**
	 * createRepo creates repo on remote platform, eg. github, gitlab.
	 * @param repoName name of remote repo
	 * @param organizationName name of organization that the repo should be associated with, leave blank to create repo under your user.
	 * @returns url to the created repo
	 */
	createRepo(repoName: string, organizationName?: string): Promise<string>;

	/**
	 * listOrganizations lists all organizations that user has access to.
	 */
	listOrganizations(): Promise<string[]>;

	isLoggedIn(): Promise<boolean>;
	login(token: string): Promise<void>;
	signOut(): Promise<void>;
}

export class NoopProvider {
	static readonly noopErrorMessage = 'Called noop provider';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	createRepo(repoName: string, organizationName?: string): Promise<string> {
		throw new Error(NoopProvider.noopErrorMessage);
	}
	listOrganizations(): Promise<string[]> {
		throw new Error(NoopProvider.noopErrorMessage);
	}
	isLoggedIn(): Promise<boolean> {
		throw new Error(NoopProvider.noopErrorMessage);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	login(token: string): Promise<void> {
		throw new Error(NoopProvider.noopErrorMessage);
	}
	signOut(): Promise<void> {
		throw new Error(NoopProvider.noopErrorMessage);
	}
}
