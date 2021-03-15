const fs = require('fs');
const { execFileSync } = require('child_process');
const sleep = require('atomic-sleep');
const { config } = require('./config');
const appBase = require('../app-base');

function stop() {
  if (fs.existsSync(config.pidFilePath)) {
    process.stdout.write(`Stopping ${config.serviceName}\n`);
    try {
      execFileSync(config.binPath, config.paramsStop, { cwd: config.dataPath });
      // todo: wait for nginx stopped gracefully
      sleep(1000);
    } catch (error) {
      process.stderr.write(`Service ${config.serviceName} stoping failed ${error}! Try to kill...\n`);
      appBase.stop(config);
    }
  } else {
    process.stdout.write(`Service ${config.serviceName} is not started!\n`);
  }
}

module.exports.start = () => appBase.start(config);
module.exports.stop = stop;
module.exports.status = () => appBase.status(config);
