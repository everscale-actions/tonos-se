const serviceName = 'ton-node';
const path = require('path');
const os = require('os');

const appPath = path.join(global.appsPath, serviceName);
const dataPath = path.join(global.dataPath, serviceName);
const binPath = path.join(dataPath, (os.platform() === 'win32' ? 'ton_node_startup.exe' : 'ton_node_startup'));
const logsPath = path.join(global.logsPath, serviceName);
const pidFilePath = path.join(dataPath, `${serviceName}.pid`);

module.exports = {
  serviceName,
  appPath,
  binPath,
  pidFilePath,
  сreatePidFile: true,
  paramsStart: ['--config', path.join(appPath, 'cfg')],
  dataPath,
  logsPath,
  port: global.nodeSePort,
};
