const path = require('path');
const os = require('os');

const appPath = path.join(global.appsPath, 'arango');
const binPath = (os.platform() === 'win32' ? path.join(appPath, 'usr', 'bin', 'arangod.exe') : path.join(appPath, 'usr', 'sbin', 'arangod'));
const workingDir = path.join(global.dataPath, 'arango');
const pidFilePath = path.join(workingDir, 'arango.pid');

exports.getConfig = () => ({
  appPath,
  binPath,
  pidFilePath,
  paramsStart: ['--config', path.join(appPath, 'config'),
    '--server.endpoint', process.env.ARANGO_ENDPOINT,
    '--server.authentication', 'false',
    '--log.foreground-tty', 'true',
    '--javascript.startup-directory', path.join(appPath, 'usr', 'share', 'arangodb3', 'js'),
    '--javascript.app-path', path.join(appPath, 'var', 'lib', 'arangodb3-apps'),
    '--database.directory', path.join(workingDir, 'db')],
  paramsStop: [],
  workingDir,
});
