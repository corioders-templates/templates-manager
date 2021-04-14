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

	isLoggedin(): Promise<boolean>;
	login(token: string): Promise<void>;
	signout(): Promise<void>;
}
