const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const config = require('./ton-node-config');
const appBase = require('../app-base');
const transform = require('../transform');

function transformPort() {
  const portNumber = config.port;

  const targets = [
    {
      files: path.join(config.dataPath, 'cfg'),
      from: /"port": \d+,/g,
      to: `"port": ${portNumber},`,
    },
    {
      files: path.join(config.appPath, 'cfg'),
      from: /"port": \d+,/g,
      to: `"port": ${portNumber},`,
    },
  ];
  transform(targets);
}

async function start() {
  if (!fs.existsSync(config.pidFilePath)) {
    // todo: workaround because node se can't work with custom data folder
    fsExtra.copySync(config.appPath, config.dataPath, { overwrite: true });
  }

  await appBase.start(config);
}

module.exports.start = start;
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.config = config;
module.exports.prepare = transformPort;
