const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const waitOn = require('wait-on');
const ConfigParser = require('@webantic/nginx-config-parser');
const config = require('./nginx-config');
const appBase = require('../app-base');

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

function prepare() {
  if (!fs.existsSync(config.dataPath)) { fs.mkdirSync(config.dataPath, { recursive: true }); }
  const appCfgPath = path.join(config.appPath, 'conf', 'nginx.conf');
  const dataCfgPath = path.join(config.dataPath, 'nginx.conf');

  const parser = new ConfigParser();
  const cfg = parser.toJSON(fs.readFileSync(appCfgPath, 'utf8'));

  cfg.http['upstream q-server'].server = `127.0.0.1:${global.qServerPort}`;
  cfg.http['upstream ton-node'].server = `127.0.0.1:${global.nodeSeRequestsPort}`;
  cfg.http.server.listen = `${global.nginxPort} reuseport`;

  fs.writeFileSync(dataCfgPath, parser.toConf(cfg));
}

module.exports.start = () => appBase.start(config);
module.exports.stop = stop;
module.exports.status = () => appBase.status(config);
module.exports.prepare = prepare;
