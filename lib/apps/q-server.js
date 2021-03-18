const path = require('path');
const config = require('./q-server-config');
const appBase = require('../app-base');
const transform = require('../transform');

function transformPort() {
  const portNumber = config.port;

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
  transform(targets);
}

module.exports.start = () => appBase.start(config);
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.config = config;
module.exports.prepare = transformPort;
