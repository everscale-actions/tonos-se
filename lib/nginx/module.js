const fs = require('fs');
const process = require('process');
const { execFileSync } = require('child_process');
const config = require('./config').getConfig();
const { runApp } = require('../run-app');

function start() {
  runApp(config);
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
      execFileSync(config.binPath, config.paramsStop, { cwd: config.dataPath });
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
module.exports.config = config;
