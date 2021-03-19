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

  await start();
}

module.exports = reset;
