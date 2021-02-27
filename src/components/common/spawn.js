const { spawn } = require('child_process');
exports.spawn = (command, arguments, options = undefined) => {
	return new Promise((resolve, reject) => {
		const subprocess = spawn(command, arguments, options);
		subprocess.on('close', (code) => {
			if (code != 0) {
				reject(`Process completed with code ${code}`);
			} else {
				resolve();
			}
		});
		subprocess.on('error', (error) => {
			reject(error);
		});
	});
};
