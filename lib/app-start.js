const fs = require('fs');
const path = require('path');
const waitOn = require('wait-on');
const { spawn } = require('child_process');
const appStatus = require('./app-status');

async function checkDeadPid(config) {
  const status = await appStatus(config);
  if (status.pid && !status.isRunning) {
    process.stdout.write(`It looks like the process (PID: ${status.pid}) does not exist. PID file will be removed.\n`);
    fs.rmSync(config.pidFilePath);
  }
}

async function start(config) {
  await checkDeadPid(config);

  if (!fs.existsSync(config.pidFilePath)) {
    process.stdout.write(`* Starting ${config.serviceName}.. `);

    // create folder's structure
    if (!fs.existsSync(config.logsPath)) { fs.mkdirSync(config.logsPath, { recursive: true }); }
    if (!fs.existsSync(config.dataPath)) { fs.mkdirSync(config.dataPath, { recursive: true }); }
    if (!fs.existsSync(path.dirname(config.pidFilePath))) {
      fs.mkdirSync(path.dirname(config.pidFilePath), { recursive: true });
    }

    // check for port is available
    await waitOn({ resources: [`tcp:localhost:${config.port}`], timeout: 1000, reverse: true });

    if (config.env) {
      Object.entries(config.env).forEach(([key, value]) => {
        process.env[key] = value;
      });
    }

    const logStream = config.logsPath ? fs.openSync(path.join(config.logsPath, 'stdout.log'), 'w') : 'ignore';
    const errStream = config.logsPath ? fs.openSync(path.join(config.logsPath, 'stderr.log'), 'w') : 'ignore';
    const proc = spawn(config.binPath, config.paramsStart, { cwd: config.dataPath, detached: true, stdio: ['ignore', logStream, errStream] });

    if (config.сreatePidFile) {
      fs.writeFileSync(config.pidFilePath, proc.pid.toString());
    }
    // check for port is used by process
    await waitOn({ resources: [`tcp:localhost:${config.port}`], timeout: 30000, tcpTimeout: 1000 });
    proc.unref();
    process.stdout.write('Done \n');
  } else {
    process.stdout.write(`Service ${config.serviceName} already started!\n`);
  }
}

module.exports = start;
