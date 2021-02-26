const { resolve } = require('path');
const { homedir } = require('os');

//COMPUTER HOME
exports.HOME_DIR = homedir();
exports.CONFIG_DIR = resolve(this.HOME_DIR, '.corioders', 'cli');
exports.CONFIG_PATH = resolve(this.CONFIG_DIR, 'userConfig.json');

//CLI
exports.ROOT_DIR = resolve(__dirname, '..', '..', '..');
exports.TEMPLATES_PATH = resolve(this.ROOT_DIR, 'data', 'templates.json');
exports.STMUX_DIR = resolve(this.ROOT_DIR, 'node_modules', 'stmux');
exports.STMUX_PATH = resolve(this.STMUX_DIR, 'bin', 'stmux.js');
exports.STMUX_KEYS_PATH = resolve(this.STMUX_DIR, 'src/stmux-9-keys.js');

//PROJECT
const { name } = require(this.CONFIG_PATH);
exports.PROJECT_DIR_OUTSIDE = resolve(process.cwd(), name);
exports.PROJECT_DIR_INSIDE = process.cwd();
exports.PROJECT_DIR = (isDuringCreate = false) => (isDuringCreate ? this.PROJECT_DIR_OUTSIDE : this.PROJECT_DIR_INSIDE);
exports.APP_DIR = (isDuringCreate = false) => resolve(isDuringCreate ? this.PROJECT_DIR_OUTSIDE : this.PROJECT_DIR_INSIDE, 'app');
exports.TOOLS_DIR = (isDuringCreate = false) => resolve(isDuringCreate ? this.PROJECT_DIR_OUTSIDE : this.PROJECT_DIR_INSIDE, 'tools');
exports.SERVER_DIR = (isDuringCreate = false) => resolve(isDuringCreate ? this.PROJECT_DIR_OUTSIDE : this.PROJECT_DIR_INSIDE, 'server');
exports.JSON_PATH = (isDuringCreate = false) => resolve(this.APP_DIR(isDuringCreate), 'package.json');
