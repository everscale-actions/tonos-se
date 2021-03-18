const serviceName = 'arango';
const path = require('path');
const os = require('os');

const appPath = path.join(global.appsPath, serviceName);
const binPath = (os.platform() === 'win32' ? path.join(appPath, 'usr', 'bin', 'arangod.exe') : path.join(appPath, 'usr', 'sbin', 'arangod'));
const binPathClient = (os.platform() === 'win32' ? path.join(appPath, 'usr', 'bin', 'arangosh.exe') : path.join(appPath, 'usr', 'bin', 'arangosh'));
const migrationsPath = path.join(appPath, 'initdb.d');
const dataPath = path.join(global.dataPath, serviceName);
const logsPath = path.join(global.logsPath, serviceName);
const pidFilePath = path.join(dataPath, `${serviceName}.pid`);

exports.config = {
  serviceName,
  appPath,
  binPath,
  pidFilePath,
  сreatePidFile: true,
  paramsStart: ['--config', path.join(appPath, 'config'),
    '--server.endpoint', process.env.ARANGO_ENDPOINT,
    '--server.authentication', 'false',
    '--log.foreground-tty', 'true',
    '--javascript.startup-directory', path.join(appPath, 'usr', 'share', 'arangodb3', 'js'),
    '--javascript.app-path', path.join(appPath, 'var', 'lib', 'arangodb3-apps'),
    '--database.directory', path.join(dataPath, 'db')],
  paramsStop: [],
  paramsMigrations: ['-c', 'none',
    '--server.authentication', 'false',
    '--javascript.startup-directory', path.join(appPath, 'usr', 'share', 'arangodb3', 'js'),
    `--server.endpoint=${process.env.ARANGO_ENDPOINT}`,
    '--javascript.execute'],
  dataPath,
  logsPath,
  binPathClient,
  migrationsPath,
  logFile: path.join(logsPath, `${serviceName}.log`),
  errFile: path.join(logsPath, `${serviceName}.err`),
  port: 7433,
};
