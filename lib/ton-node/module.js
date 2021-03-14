const fs = require('fs');
const fsExtra = require('fs-extra');
const { config } = require('./config');
const { runApp } = require('../run-app');
const { getStatus } = require('../get-status');

function start() {
  if (!fs.existsSync(config.pidFilePath)) {
    // todo: workaround because node se can't work with custom data folder
    fsExtra.copySync(`${config.appPath}`, config.dataPath, { overwrite: true });
  }

  runApp(config);
}

function stop() {
  if (fs.existsSync(config.pidFilePath)) {
    console.log(`Stopping ${config.serviceName}...`);
    const pid = fs.readFileSync(config.pidFilePath);
    try {
      process.kill(pid);
    } catch (error) {
      console.log(`Kill process ${pid} failed with error: ${error}`);
    }
    if (fs.existsSync(config.pidFilePath)) { fs.rmSync(config.pidFilePath); }
  } else {
    console.warn(`${config.serviceName} is not started!`);
  }
}

function status() {
  return getStatus(config);
}

module.exports.stop = stop;
module.exports.start = start;
module.exports.status = status;
