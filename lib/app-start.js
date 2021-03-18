const fs = require('fs');
const path = require('path');
const waitOn = require('wait-on');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const appStatus = require('./app-status');

function reloadEnvs() {
  const envConfig = dotenv.parse(fs.readFileSync(global.envFilePath));
  Object.keys(envConfig)
    .forEach((k) => {
      process.env[k] = envConfig[k];
    });
}

async function start(config, setPort) {
  // delete dead pid files
  await appStatus(config);

  setPort();

  reloadEnvs();

  if (!fs.existsSync(config.pidFilePath)) {
    process.stdout.write(`Starting ${config.serviceName}.. `);

    // create folder's structure
    if (!fs.existsSync(config.logsPath)) { fs.mkdirSync(config.logsPath, { recursive: true }); }
    if (!fs.existsSync(config.dataPath)) { fs.mkdirSync(config.dataPath, { recursive: true }); }
    if (!fs.existsSync(path.dirname(config.pidFilePath))) {
      fs.mkdirSync(path.dirname(config.pidFilePath), { recursive: true });
    }

    const logStream = config.logFile ? fs.openSync(config.logFile, 'w') : 'ignore';
    const errStream = config.errFile ? fs.openSync(config.errFile, 'w') : 'ignore';
    const proc = spawn(config.binPath, config.paramsStart, { cwd: config.dataPath, detached: true, stdio: ['ignore', logStream, errStream] });
    if (config.сreatePidFile) {
      fs.writeFileSync(config.pidFilePath, proc.pid.toString());
    }
    await waitOn({ resources: [`tcp:localhost:${config.port}`], timeout: 15000, tcpTimeout: 1000 });
    proc.unref();
    process.stdout.write('Done \n');
  } else {
    process.stdout.write(`Service ${config.serviceName} already started!\n`);
  }
}

module.exports = start;
