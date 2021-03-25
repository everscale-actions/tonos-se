const serviceName = 'arango';
const path = require('path');
const os = require('os');
const config = require('../app-config-base')(serviceName);

const arangoEndpoing = `tcp://127.0.0.1:${global.arangoPort}`;

config.binPath = (os.platform() === 'win32' ? path.join(config.appPath, 'usr', 'bin', 'arangod.exe') : path.join(config.appPath, 'usr', 'sbin', 'arangod'));
config.binPathClient = (os.platform() === 'win32' ? path.join(config.appPath, 'usr', 'bin', 'arangosh.exe') : path.join(config.appPath, 'usr', 'bin', 'arangosh'));
config.migrationsPath = path.join(config.appPath, 'initdb.d');

config.сreatePidFile = true;
config.paramsStart = [
  '--config', path.join(config.appPath, 'config'),
  '--server.endpoint', arangoEndpoing,
  '--server.authentication', 'false',
  '--log.foreground-tty', 'true',
  '--javascript.startup-directory', path.join(config.appPath, 'usr', 'share', 'arangodb3', 'js'),
  '--javascript.app-path', path.join(config.appPath, 'var', 'lib', 'arangodb3-apps'),
  '--database.directory', path.join(config.dataPath, 'db'),
];
config.paramsMigrations = [
  '-c', 'none',
  '--server.authentication', 'false',
  '--javascript.startup-directory', path.join(config.appPath, 'usr', 'share', 'arangodb3', 'js'),
  `--server.endpoint=${arangoEndpoing}`,
  '--javascript.execute',
];
config.ports = [global.arangoPort];

module.exports = config;
