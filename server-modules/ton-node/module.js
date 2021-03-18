const fs = require('fs');
const fsExtra = require('fs-extra');
const { config } = require('./config');
const appBase = require('../../lib/app-base');

async function start() {
  if (!fs.existsSync(config.pidFilePath)) {
    // todo: workaround because node se can't work with custom data folder
    fsExtra.copySync(`${config.appPath}`, config.dataPath, { overwrite: true });
  }

  await appBase.start(config);
}

module.exports.start = start;
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.config = config;
