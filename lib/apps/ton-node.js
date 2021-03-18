const fs = require('fs');
const fsExtra = require('fs-extra');
const config = require('./ton-node-config');
const appBase = require('../app-base');

function prepare() {
  if (!fs.existsSync(config.pidFilePath)) {
    // todo: workaround because node se can't work with custom data folder
    fsExtra.copySync(config.appPath, config.dataPath, { overwrite: true });
  }
}

module.exports.start = () => appBase.start(config);
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.prepare = prepare;
