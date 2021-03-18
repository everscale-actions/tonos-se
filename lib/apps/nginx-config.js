const serviceName = 'nginx';
const path = require('path');
const os = require('os');

// todo: should be refactored
const port = require('../app-config').getConfig()[`${serviceName}-port`];

const appPath = path.join(global.appsPath, serviceName);
const binPath = path.join(appPath, 'nginx') + (os.platform() === 'win32' ? '.exe' : '');
const dataPath = path.join(global.dataPath, serviceName);
const logsPath = path.join(global.logsPath, serviceName);
const pidFilePath = path.join(dataPath, `${serviceName}.pid`);

module.exports = {
  serviceName,
  appPath,
  binPath,
  pidFilePath,
  paramsStart: ['-c', `${path.join(appPath, 'conf', 'nginx.conf')}`],
  paramsStop: ['-c', `${path.join(appPath, 'conf', 'nginx.conf')}`, '-s', 'stop'],
  dataPath,
  logsPath,
  logFile: path.join(logsPath, `${serviceName}.log`),
  errFile: path.join(logsPath, `${serviceName}.err`),
  port,
};
