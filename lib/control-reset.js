const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const stop = require('./control-stop');

async function reset(hard) {
  await stop();

  if (hard) {
    if (fs.existsSync(global.serverPath)) {
      rimraf.sync(global.serverPath);
    }
  } else if (fs.existsSync(global.appsPath)) {
    rimraf.sync(global.appsPath);
    rimraf.sync(path.join(global.dataPath, 'settings.json'));
  }

  console.log(`All applications${hard ? 'and data' : ''} have been removed. Use '${global.appName} start' command to start all over again.`);
}

module.exports = reset;
