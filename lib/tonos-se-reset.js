const rimraf = require('rimraf');
const { reset: configReset } = require('./tonos-se-config');
const stop = require('./tonos-se-stop');

async function reset(hard) {
  await stop();

  if (hard) {
    rimraf.sync(global.appRoot);
  } else {
    await configReset();
    rimraf.sync(global.appsPath);
  }

  process.stdout.write(`All applications${hard ? ' and data ' : ' '}have been removed. Use '${global.appName} start' command to start all over again.\n`);
}

module.exports = reset;
