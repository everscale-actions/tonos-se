const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const { config } = require('./config');
const appBase = require('../../lib/app-base');
const appConfig = require('../../lib/app-config');
const { setPortBase } = require('../../lib/control-ports');

function setPort() {
  const portNumber = JSON.parse(appConfig.getConfig())[`${config.serviceName}-port`];
  const portNumberArango = JSON.parse(appConfig.getConfig())['arango-port'];

  const targets = [
    {
      files: path.join(config.dataPath, 'cfg'),
      from: /"port": \d+,/g,
      to: `"port": ${portNumber},`,
    },
    {
      files: path.join(config.dataPath, 'cfg'),
      from: /"server": "127\.0\.0\.1:\d+",/g,
      to: `"server 127.0.0.1:${portNumberArango}",`,
    },
  ];
  setPortBase(targets);
}

async function start() {
  if (!fs.existsSync(config.pidFilePath)) {
    // todo: workaround because node se can't work with custom data folder
    fsExtra.copySync(config.appPath, config.dataPath, { overwrite: true });
  }

  await appBase.start(config, () => setPort());
}

module.exports.start = start;
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.config = config;
