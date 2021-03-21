const serviceName = 'q-server';
const path = require('path');

const appPath = path.join(global.appsPath, serviceName);
const dataPath = path.join(global.dataPath, serviceName);
const logsPath = path.join(global.logsPath, serviceName);
const pidFilePath = path.join(dataPath, `${serviceName}.pid`);

const arangoEndpoint = `http://127.0.0.1:${global.arangoPort}`;

module.exports = {
  serviceName,
  appPath,
  binPath: 'node',
  pidFilePath,
  сreatePidFile: true,
  paramsStart: ['index.js'],
  dataPath: appPath,
  logsPath,
  env: {
    Q_DATA_MUT: arangoEndpoint,
    Q_DATA_HOT: arangoEndpoint,
    Q_SLOW_QUERIES_MUT: arangoEndpoint,
    Q_SLOW_QUERIES_HOT: arangoEndpoint,
    Q_REQUESTS_MODE: 'rest',
    Q_REQUESTS_SERVER: `http://127.0.0.1:${global.nginxPort}`,
    Q_HOST: '127.0.0.1',
    Q_PORT: global.qServerPort,
  },
  ports: [global.qServerPort],
};
