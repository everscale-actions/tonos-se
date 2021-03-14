const serviceName = 'ton-node';
const path = require('path');
const os = require('os');
const fs = require('fs');

const appPath = path.join(global.appsPath, serviceName);
const dataPath = path.join(global.dataPath, serviceName);
const binPath = path.join(dataPath, (os.platform() === 'win32' ? 'ton_node_startup.exe' : 'ton_node_startup'));
const logsPath = path.join(global.logsPath, serviceName);
const pidFilePath = path.join(dataPath, `${serviceName}.pid`);

if (!fs.existsSync(logsPath)) { fs.mkdirSync(logsPath, { recursive: true }); }

exports.getConfig = () => ({
  serviceName,
  appPath,
  binPath,
  pidFilePath,
  paramsStart: ['--config', path.join(appPath, 'cfg')],
  dataPath,
  logFile: path.join(logsPath, 'ton-node.log'),
  errFile: path.join(logsPath, 'ton-node.err'),
});
