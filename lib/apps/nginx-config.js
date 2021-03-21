const serviceName = 'nginx';
const path = require('path');
const os = require('os');

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
  paramsStart: ['-c', `${path.join(dataPath, 'nginx.conf')}`],
  paramsStop: ['-c', `${path.join(dataPath, 'nginx.conf')}`, '-s', 'stop'],
  dataPath,
  logsPath,
  ports: [global.nginxPort],
};
