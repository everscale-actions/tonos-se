const fs = require('fs');
const waitOn = require('wait-on');
const { retry } = require('@lifeomic/attempt');
const isRunning = require('is-running');

async function stop(config) {
  if (fs.existsSync(config.pidFilePath)) {
    process.stdout.write(`Stopping service ${config.serviceName}.. `);
    const pid = fs.readFileSync(config.pidFilePath);
    try {
      process.kill(pid);
      await waitOn({
        resources: [`tcp:127.0.0.1:${config.port}`], reverse: true, timeout: 5000,
      });

      await retry(async () => new Promise((resolve, reject) => { if (isRunning(pid)) reject(new Error('Process still exists')); resolve(); }), {
        minDelay: 100,
        delay: 200,
        factor: 2,
        maxAttempts: 10,
        maxDelay: 1000,
      });
    } catch (error) {
      process.stderr.write(`Stop process ${pid} failed with error: ${error} `);
    } finally {
      fs.rmSync(config.pidFilePath);
    }
    process.stdout.write('Done\n');
  } else {
    process.stdout.write(`Service ${config.serviceName} is not started!\n`);
  }
}

module.exports = stop;
