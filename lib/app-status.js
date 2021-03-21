const fs = require('fs');
const isRunning = require('is-running');
const tcpPortUsed = require('tcp-port-used');

async function status(config) {
  const pidFile = config.pidFilePath;

  const pid = fs.existsSync(pidFile) ? fs.readFileSync(pidFile).toString().trim() : undefined;
  const portStatuses = await Promise.all(
    config.ports.map(async (port) => ({ port, inUse: await tcpPortUsed.check(port) })),
  );
  return {
    serviceName: config.serviceName,
    pid,
    isRunning: pid ? isRunning(pid) : false,
    portStatuses,
  };
}

module.exports = status;
