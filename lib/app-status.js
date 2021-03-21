const fs = require('fs');
const isRunning = require('is-running');

async function status(config) {
  const pidFile = config.pidFilePath;
  return new Promise((resolve) => {
    const pid = fs.existsSync(pidFile) ? fs.readFileSync(pidFile).toString().trim() : undefined;
    resolve({
      serviceName: config.serviceName,
      pid,
      isRunning: pid ? isRunning(pid) : undefined,
    });
  });
}

module.exports = status;
