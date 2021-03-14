const serviceName = 'nginx';
const path = require('path');
const os = require('os');

const appPath = path.join(global.appsPath, 'nginx');
const binPath = path.join(appPath, 'nginx') + (os.platform() === 'win32' ? '.exe' : '');
const dataPath = path.join(global.dataPath, 'nginx');
const pidFilePath = path.join(dataPath, 'nginx.pid');

exports.getConfig = () => ({
  serviceName,
  appPath,
  binPath,
  pidFilePath,
  paramsStart: ['-c', `${path.join(appPath, 'conf', 'nginx.conf')}`],
  paramsStop: ['-c', `${path.join(appPath, 'conf', 'nginx.conf')}`, '-s', 'stop'],
  dataPath,
});
