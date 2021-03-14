const fs = require('fs');
const process = require('process');
const config = require('./config').getConfig();
const serverManagement = require('../serverManagement/management');

function start() {
  if (!fs.existsSync(config.pidFilePath)) {
    console.log('Starting nginx');
    serverManagement.runApp(
      config.binPath, config.paramsStart, config.workingDir,
    );
  } else {
    console.warn('Nginx already started!');
  }
}

function kill() {
  const pid = fs.readFileSync(config.pidFilePath);
  try {
    process.kill(pid);
  } catch (error) {
    console.log(`Kill process ${pid} failed with error: ${error}`);
  }
  if (fs.existsSync(config.pidFilePath)) { fs.rmSync(config.pidFilePath); }
}

function stop() {
  if (fs.existsSync(config.pidFilePath)) {
    console.log('Stopping Nginx');
    try {
      serverManagement.runApp(config.binPath, config.paramsStop, config.workingDir);
    } catch (error) {
      console.warn(`Nginx stoping failed ${error}! Try to kill...`);
      kill();
    }
  } else {
    console.warn('Nginx is not started!');
  }
}

module.exports.stop = stop;
module.exports.start = start;
