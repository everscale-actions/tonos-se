const fs = require('fs');
const rimraf = require('rimraf');
const start = require('./control-start');
const stop = require('./control-stop');

async function reset(force) {
  await stop();
  if (force) {
    if (fs.existsSync(global.serverPath)) {
      rimraf.sync(global.serverPath);
    }
  } else if (fs.existsSync(global.appsPath)) {
    rimraf.sync(global.appsPath);
  }

  console.log('All applications and data has been removed. Use \'tonos-se start\' command to start all over again.');
}

module.exports = reset;
