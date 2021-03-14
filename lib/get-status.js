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
  process.stdout.write(`It looks like the process (PID: ${pid}) does not exist. Try to use 'ton-node stop' and then 'ton-node start' command to fix the problem\n`);
  return 'not found';
}

async function getStatus(config) {
  const status = await getStatusInternal(config.pidFilePath);
  return `Service ${config.serviceName} is ${status}\n`;
}

module.exports.getStatus = getStatus;
