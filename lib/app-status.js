const fs = require('fs');
const isRunning = require('is-running');

async function getStatusInternal(pidFilePath) {
  if (!fs.existsSync(pidFilePath)) {
    return 'stopped';
  }

  const pid = fs.readFileSync(pidFilePath, 'utf8').trim();
  if (isRunning(pid)) {
    return `running. Pid: ${pid}`;
  }
  fs.rmSync(pidFilePath);
  process.stdout.write(`It looks like the process (PID: ${pid}) does not exist. PID file will be removed.\n`);
  return 'not found';
}

async function status(config) {
  const st = await getStatusInternal(config.pidFilePath);
  return `Service ${config.serviceName} is ${st}\n`;
}

module.exports = status;