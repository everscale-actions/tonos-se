const fs = require('fs');
const fsExtra = require('fs-extra');
const config = require('./config').getConfig();
const control = require('../control');

function start() {
  if (!fs.existsSync(config.pidFilePath)) {
    // todo: workaround because node se can't work with custom data folder
    fsExtra.copySync(`${config.appPath}`, config.workingDir, { overwrite: true });

    console.log(`Starting ${config.serviceName}...`);
    control.runApp(
      config.binPath,
      config.paramsStart,
      config.workingDir,
      config.pidFilePath,
      config.logFile,
      config.errFile,
    );
  } else {
    console.warn(`${config.serviceName} already started!`);
  }
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

module.exports.stop = stop;
module.exports.start = start;
