const serviceName = 'q-server';
const config = require('../app-config-base')(serviceName);

const arangoEndpoint = `http://127.0.0.1:${global.arangoPort}`;

config.binPath = 'node';
// q-server works from apps dir
config.dataPath = config.appPath;
config.paramsStart = ['index.js'];
config.сreatePidFile = true;
config.env = {
  Q_DATA_MUT: arangoEndpoint,
  Q_DATA_HOT: arangoEndpoint,
  Q_SLOW_QUERIES_MUT: arangoEndpoint,
  Q_SLOW_QUERIES_HOT: arangoEndpoint,
  Q_REQUESTS_MODE: 'rest',
  Q_REQUESTS_SERVER: `http://127.0.0.1:${global.nginxPort}`,
  Q_HOST: '127.0.0.1',
  Q_PORT: global.qServerPort,
};
config.ports = [global.qServerPort];

module.exports = config;
