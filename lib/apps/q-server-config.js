const serviceName = 'q-server';
const path = require('path');

// todo: should be refactored
const port = require('../app-config').getConfig()[`${serviceName}-port`];

const appPath = path.join(global.appsPath, serviceName);
const dataPath = path.join(global.dataPath, serviceName);
const logsPath = path.join(global.logsPath, serviceName);
const pidFilePath = path.join(dataPath, `${serviceName}.pid`);

module.exports = {
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
  port,
};
