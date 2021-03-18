const fs = require('fs');
const { execFileSync } = require('child_process');
const waitOn = require('wait-on');
const path = require('path');
const replace = require('replace-in-file');
const { config } = require('./config');
const appBase = require('../../lib/app-base');

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
function setPort(portNumber) {
  const options = {
    files: path.join(config.appPath, 'conf', 'nginx.conf'),
    from: /listen \d+ reuseport;/g,
    to: `listen ${portNumber} reuseport;`,
  };
  console.log(options);
  const results = replace.sync(options);
  console.log('Replacement results:', results);
}

module.exports.start = () => appBase.start(config);
module.exports.stop = stop;
module.exports.setPort = setPort;
module.exports.status = () => appBase.status(config);
module.exports.config = config;
