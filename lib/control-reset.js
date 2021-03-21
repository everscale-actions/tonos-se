const fs = require('fs');
const rimraf = require('rimraf');
const stop = require('./control-stop');

async function reset(hard) {
  await stop();

  if (hard) {
    if (fs.existsSync(global.serverPath)) {
      rimraf.sync(global.serverPath);
    }
  } else if (fs.existsSync(global.appsPath)) {
    rimraf.sync(global.appsPath);
  }

  rimraf.sync(global.cachePath);

  console.log(`All applications and data has been removed. Use '${global.appName} start' command to start all over again.`);
}

module.exports = reset;
