export interface Provider {
	/**
	 * createRepo creates repo on remote platform, eg. github, gitlab.
	 * @param repoName, this is the name of remote repo
	 */
	createRepo(organizationName: string, repoName: string): Promise<void>;

	isLogged(): Promise<boolean>;
	login(token: string): Promise<void>;
	signout(): Promise<void>;
}
