const serviceName = 'q-server';
const path = require('path');

const appPath = path.join(global.appsPath, serviceName);
const dataPath = path.join(global.dataPath, serviceName);
const logsPath = path.join(global.logsPath, serviceName);
const pidFilePath = path.join(dataPath, `${serviceName}.pid`);

exports.config = {
  serviceName,
  appPath,
  binPath: 'node',
  pidFilePath,
  сreatePidFile: true,
  paramsStart: ['index.js'],
  dataPath: appPath,
  logsPath,
  logFile: path.join(logsPath, `${serviceName}.log`),
  errFile: path.join(logsPath, `${serviceName}.err`),
  port: 4000
};
