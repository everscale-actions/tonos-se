const fs = require('fs');
const path = require('path');
const { execFileSync, execFile } = require('child_process');
const ConfigParser = require('@webantic/nginx-config-parser');
const { retry } = require('@lifeomic/attempt');
const config = require('./nginx-config');
const app = require('../app-base')(config);
const appBaseStart = require('../app-base-start');

function transformConfig() {
  const appCfgPath = path.join(config.appPath, 'nginx.conf');
  const dataCfgPath = path.join(config.dataPath, 'nginx.conf');

  const parser = new ConfigParser();
  const cfg = parser.toJSON(fs.readFileSync(appCfgPath, 'utf8'));

  cfg.user = 'nobody';

  cfg.pid = `"${config.pidFilePath.split('\\').join('/')}"`;

  cfg.http['upstream q-server'].server = `127.0.0.1:${global.qServerPort}`;
  cfg.http['upstream ton-node'].server = `127.0.0.1:${global.nodeSeRequestsPort}`;
  cfg.http.server.listen = `${global.nginxPort} reuseport`;

  cfg.http.error_log = `"${path.join(config.logsPath, 'error.log').split('\\').join('/')}"`;
  cfg.http.access_log = `"${path.join(config.logsPath, 'access.log').split('\\').join('/')}"`;

  fs.writeFileSync(dataCfgPath, parser.toConf(cfg));
}

function getIsPidFileExistsAction(pidFilePath) {
  return async () => new Promise((resolve, reject) => {
    if (fs.existsSync(pidFilePath)) {
      reject(new Error('Process still exists'));
    }
    resolve();
  });
}

app.stop = async () => {
  const status = await app.status();
  if (!status.isRunning) {
    return;
  }
  process.stdout.write(`* Stopping ${config.serviceName}.. `);
  const logStream = config.logFile ? fs.openSync(config.logFile, 'a') : 'ignore';
  const errStream = config.errFile ? fs.openSync(config.errFile, 'a') : 'ignore';

  execFileSync(config.binPath, config.paramsStop, { cwd: config.dataPath, stdio: ['ignore', logStream, errStream] });

  await retry(getIsPidFileExistsAction(config.pidFilePath), { delay: 500, maxAttempts: 20 });
  process.stdout.write('Done\n');
};

app.start = async () => {
  transformConfig();
  await appBaseStart(config);
};

app.version = async () => new Promise((resolve, reject) => {
  execFile(config.binPath, ['-v'], (error, stdout, stderr) => {
    if (error) {
      reject(error);
    }
    const version = stderr.split(':')[1].trim();
    resolve({ app: config.serviceName, version });
  });
});

module.exports = app;
