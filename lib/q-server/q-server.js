const fs = require('fs');
const { execSync } = require('child_process');
const config = require('./config').getConfig();
const serverManagement = require('../serverManagement/management');

function start() {
  if (!fs.existsSync(config.pidFilePath)) {
    console.log(`Starting ${config.serviceName}...`);

    execSync('npm install --production --force', { cwd: config.appPath });

    serverManagement.runApp(
      config.binPath,
      config.paramsStart,
      config.appPath,
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
