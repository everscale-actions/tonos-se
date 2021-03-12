const path = require('path');
const os = require('os');

console.log(global.appRoot);

const appPath = path.join(global.appsPath, 'nginx');
const binPath = path.join(appPath, 'nginx') + (os.platform() === 'win32' ? '.exe' : '');
const workingDir = path.join(global.dataPath, 'nginx');
const pidFilePath = path.join(workingDir, 'nginx.pid');

exports.getConfig = () => ({
  appPath,
  binPath,
  pidFilePath,
  paramsStart: ['-c', `${path.join(appPath, 'conf', 'nginx.conf')}`, '-g', 'daemon off;'],
  paramsStop: ['-c', `${path.join(appPath, 'conf', 'nginx.conf')}`, '-s', 'stop'],
  workingDir,
});
