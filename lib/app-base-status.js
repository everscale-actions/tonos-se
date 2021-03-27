const fs = require('fs');
const isRunningCheck = require('is-running');
const tcpPortUsed = require('tcp-port-used');

async function status(config) {
  const pidFile = config.pidFilePath;
  let pid = fs.existsSync(pidFile) ? fs.readFileSync(pidFile).toString().trim() : undefined;
  const isRunning = pid ? isRunningCheck(pid) : false;
  if (pid && !isRunning) {
    fs.rmSync(config.pidFilePath);
    pid = undefined;
  }

  const portStatuses = await Promise.all(
    config.ports.map(async (port) => ({ port, inUse: await tcpPortUsed.check(port) })),
  );

  return {
    serviceName: config.serviceName,
    pid,
    isRunning,
    portStatuses,
  };
}

module.exports = status;
