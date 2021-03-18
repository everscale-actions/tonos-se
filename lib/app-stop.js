const fs = require('fs');
const waitOn = require('wait-on');

async function stop(config) {
  if (fs.existsSync(config.pidFilePath)) {
    process.stdout.write(`Stopping service ${config.serviceName}.. `);
    const pid = fs.readFileSync(config.pidFilePath);
    try {
      process.kill(pid);
      await waitOn({ resources: [`tcp:localhost:${config.port}`], reverse: true, timeout: 5000 });
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
