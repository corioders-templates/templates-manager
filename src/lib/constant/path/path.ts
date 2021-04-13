import * as os from 'os';
import * as path from 'path';

export const homedir = os.homedir();
export const dotcorioders = path.resolve(homedir, '.corioders');
