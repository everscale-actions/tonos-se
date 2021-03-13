const serviceName = 'q-server';
const path = require('path');
const fs = require('fs');

const appPath = path.join(global.appsPath, serviceName);
const dataPath = path.join(global.dataPath, serviceName);
const binPath = 'node';
const logsPath = path.join(global.logsPath, serviceName);
const pidFilePath = path.join(dataPath, `${serviceName}.pid`);

if (!fs.existsSync(logsPath)) { fs.mkdirSync(logsPath, { recursive: true }); }
if (!fs.existsSync(dataPath)) { fs.mkdirSync(dataPath, { recursive: true }); }

exports.getConfig = () => ({
  serviceName,
  appPath,
  binPath,
  pidFilePath,
  paramsStart: ['index.js'],
  dataPath,
  logFile: path.join(logsPath, 'q-server.log'),
  errFile: path.join(logsPath, 'q-server.err'),
});
