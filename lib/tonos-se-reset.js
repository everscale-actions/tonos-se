const rimraf = require('rimraf');
const { reset: configReset } = require('./tonos-se-config');
const stop = require('./tonos-se-stop');

async function reset(hard) {
  await stop();

  await configReset();

  if (hard) {
    rimraf.sync(global.serverPath);
  } else {
    rimraf.sync(global.appsPath);
  }

  process.stdout.write(`All applications ${hard ? 'and data' : ''} have been removed. Use '${global.appName} start' command to start all over again.\n`);
}

module.exports = reset;
