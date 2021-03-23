const fs = require('fs');
const path = require('path');
const { retry } = require('@lifeomic/attempt');
const { spawn } = require('child_process');
const appStatus = require('./app-status');
const PortsAlreadyInUseError = require('./errors/ports-already-in-use');

async function checkDeadPid(config) {
  const status = await appStatus(config);
  if (status.pid && !status.isRunning) {
    process.stdout.write(`It looks like the process (PID: ${status.pid}) does not exist. PID file will be removed.\n`);
    fs.rmSync(config.pidFilePath);
  }
}

function checkPortIsAvailable(status) {
  const portInUseByServiceName = status.portStatuses
    .filter((p) => p.inUse)
    .map((p) => ({ serviceName: status.serviceName, port: p.port }));

  if (portInUseByServiceName.length > 0) {
    throw new PortsAlreadyInUseError(portInUseByServiceName);
  }
}

async function waitForPortsAreUsed(config) {
  await retry(async () => {
    const status = await appStatus(config);
    const notOccupaiedPorts = status.portStatuses
      .filter((p) => !p.inUse)
      .map((p) => p.port);

    if (notOccupaiedPorts.length > 0) {
      // todo: create specified error
      throw new Error(`Service ${config.serviceName} doesn't occupy ports ${notOccupaiedPorts.join(',')} in time.`);
    }
  }, { delay: 500, maxAttempts: 30 });
}

async function start(config) {
  await checkDeadPid(config);
  const status = await appStatus(config);

  if (!status.isRunning) {
    process.stdout.write(`* Starting ${config.serviceName}.. `);

    checkPortIsAvailable(status);

    // create folder's structure
    if (!fs.existsSync(config.logsPath)) { fs.mkdirSync(config.logsPath, { recursive: true }); }
    if (!fs.existsSync(config.dataPath)) { fs.mkdirSync(config.dataPath, { recursive: true }); }
    if (!fs.existsSync(path.dirname(config.pidFilePath))) {
      fs.mkdirSync(path.dirname(config.pidFilePath), { recursive: true });
    }

    // fill environment variables
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
    proc.unref();

    await waitForPortsAreUsed(config);

    process.stdout.write('Done \n');
  } else {
    process.stdout.write(`* Service ${config.serviceName} already started!\n`);
  }
}

module.exports = start;
