const serviceName = 'ton-node';
const path = require('path');
const os = require('os');
const fs = require('fs');

const appPath = path.join(global.appsPath, serviceName);
const workingDir = path.join(global.dataPath, serviceName);
const binPath = path.join(workingDir, (os.platform() === 'win32' ? 'ton_node_startup.exe' : 'ton_node_startup'));
const logsPath = path.join(global.logsPath, serviceName);
const pidFilePath = path.join(workingDir, `${serviceName}.pid`);

if (!fs.existsSync(logsPath)) { fs.mkdirSync(logsPath, { recursive: true }); }

exports.getConfig = () => ({
  serviceName,
  appPath,
  binPath,
  pidFilePath,
  paramsStart: ['--config', path.join(appPath, 'cfg')],
  workingDir,
  logFile: path.join(logsPath, 'ton-node.log'),
  errFile: path.join(logsPath, 'ton-node.err'),
});
