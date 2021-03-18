const fs = require('fs');
const { execFileSync } = require('child_process');
const waitOn = require('wait-on');
const path = require('path');
const config = require('./nginx-config');
const appBase = require('../app-base');
const transform = require('../transform');

function transformPort() {
  const portNumber = config.port;

  const targets = [{
    files: path.join(config.appPath, 'conf', 'nginx.conf'),
    from: /listen \d+ reuseport;/g,
    to: `listen ${portNumber} reuseport;`,
  }, {
    files: path.join(global.envFilePath),
    from: /Q_REQUESTS_SERVER=http:\/\/127\.0\.0\.1:\d+/g,
    to: `Q_REQUESTS_SERVER=http://127.0.0.1:${portNumber}`,
  }];
  transform(targets);
}

async function stop() {
  if (fs.existsSync(config.pidFilePath)) {
    process.stdout.write(`Stopping ${config.serviceName}.. `);
    const logStream = config.logFile ? fs.openSync(config.logFile, 'a') : 'ignore';
    const errStream = config.errFile ? fs.openSync(config.errFile, 'a') : 'ignore';
    execFileSync(config.binPath, config.paramsStop, { cwd: config.dataPath, stdio: ['ignore', logStream, errStream] });
    await waitOn({ resources: [`${config.pidFilePath}`], reverse: true });
    process.stdout.write('Done\n');
  } else {
    process.stdout.write(`Service ${config.serviceName} is not started!\n`);
  }
}

module.exports.start = () => appBase.start(config);
module.exports.stop = stop;
module.exports.status = () => appBase.status(config);
module.exports.config = config;
module.exports.prepare = transformPort;