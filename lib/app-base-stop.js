const fs = require('fs');
const { retry } = require('@lifeomic/attempt');
const appStatus = require('./app-base-status');

function checkAppStopped(config) {
  return async () => {
    const status = await appStatus(config);
    if (status.isRunning) {
      throw new Error('Process still exists');
    }
  };
}

async function stop(config) {
  const status = await appStatus(config);
  if (!status.isRunning) {
    return;
  }

  process.stdout.write(`* Stopping service ${config.serviceName}.. `);
  const pid = fs.readFileSync(config.pidFilePath).toString().trim();
  try {
    process.kill(pid);
    await retry(checkAppStopped(config), { delay: 500, maxAttempts: 30 });
  } catch (error) {
    process.stderr.write(`Stop process ${pid} failed with error: ${error} `);
  }
  process.stdout.write('Done\n');
}

module.exports = stop;
