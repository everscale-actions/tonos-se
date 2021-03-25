const { join: pathJoin } = require('path');
const { mkdirSync } = require('fs');

module.exports = (serviceName) => {
  const config = {
    serviceName,
    appPath: pathJoin(global.appsPath, serviceName),
    dataPath: pathJoin(global.dataPath, serviceName),
    logsPath: pathJoin(global.logsPath, serviceName),
    pidFilePath: pathJoin(global.procPath, `${serviceName}.pid`),
  };

  mkdirSync(config.appPath, { recursive: true });
  mkdirSync(config.dataPath, { recursive: true });
  mkdirSync(config.logsPath, { recursive: true });
  mkdirSync(global.procPath, { recursive: true });

  return config;
};
