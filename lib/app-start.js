const fs = require('fs');
const path = require('path');
const waitOn = require('wait-on');
const { spawn } = require('child_process');
const appStatus = require('./app-status');

async function start(config) {
  // delete dead pid files
  await appStatus(config);

  if (!fs.existsSync(config.pidFilePath)) {
    process.stdout.write(`Starting ${config.serviceName}.. `);
    if (!fs.existsSync(config.logsPath)) { fs.mkdirSync(config.logsPath, { recursive: true }); }
    if (!fs.existsSync(config.dataPath)) { fs.mkdirSync(config.dataPath, { recursive: true }); }
    if (!fs.existsSync(path.dirname(config.pidFilePath))) {
      fs.mkdirSync(path.dirname(config.pidFilePath), { recursive: true });
    }

    const logStream = config.logFile ? fs.openSync(config.logFile, 'w') : 'ignore';
    const errStream = config.errFile ? fs.openSync(config.errFile, 'w') : 'ignore';
    const proc = spawn(config.binPath, config.paramsStart, { cwd: config.dataPath, detached: true, stdio: ['ignore', logStream, errStream] });
    await waitOn({ resources: [`tcp:localhost:${config.port}`] });
    if (config.сreatePidFile) {
      fs.writeFileSync(config.pidFilePath, proc.pid.toString());
    }
    proc.unref();
    process.stdout.write('Done \n');
  } else {
    process.stdout.write(`Service ${config.serviceName} already started!\n`);
  }
}

module.exports = start;
