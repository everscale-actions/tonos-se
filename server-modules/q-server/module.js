const path = require('path');
const { config } = require('./config');
const appBase = require('../../lib/app-base');
const appConfig = require('../../lib/app-config');
const { setPortBase } = require('../../lib/control-ports');

function setPort() {
  const portNumber = JSON.parse(appConfig.getConfig())[`${config.serviceName}-port`];
  const targets = [{
    files: path.join(global.envFilePath),
    from: /Q_PORT=\d+/g,
    to: `Q_PORT=${portNumber}`,
  },
  {
    files: path.join(global.appsPath, 'nginx', 'conf', 'nginx.conf'),
    from: /server 127\.0\.0\.1:\d+;/m,
    to: `server 127.0.0.1:${portNumber};`,
  },
  ];
  setPortBase(targets);
}

module.exports.start = () => appBase.start(config);
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.setPort = setPort;
module.exports.config = config;
