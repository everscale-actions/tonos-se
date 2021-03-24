const fs = require('fs');
const { retry } = require('@lifeomic/attempt');
const isRunning = require('is-running');

function getIsRunningPromiseAction(pid) {
  return async () => new Promise((resolve, reject) => {
    if (isRunning(pid)) {
      reject(new Error('Process still exists'));
    }
    resolve();
  });
}

async function stop(config) {
  if (fs.existsSync(config.pidFilePath)) {
    process.stdout.write(`* Stopping service ${config.serviceName}.. `);
    const pid = fs.readFileSync(config.pidFilePath).toString().trim();
    try {
      process.kill(pid);
      await retry(getIsRunningPromiseAction(pid), { delay: 500, maxAttempts: 20 });
    } catch (error) {
      process.stderr.write(`Stop process ${pid} failed with error: ${error} `);
    } finally {
      fs.rmSync(config.pidFilePath);
    }
    process.stdout.write('Done\n');
  }
}

module.exports = stop;
