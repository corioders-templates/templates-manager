import { PathLike, constants } from 'fs';

import { access } from 'fs/promises';

export async function exists(path: PathLike): Promise<boolean> {
	try {
		await access(path, constants.F_OK);
		return true;
	} catch (_: unknown) {
		return false;
	}
}
