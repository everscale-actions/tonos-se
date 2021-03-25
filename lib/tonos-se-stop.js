const fs = require('fs');
const appsPool = require('./apps/apps-pool');

async function stop() {
  if (!fs.existsSync(global.appsPath)) {
    process.stdout.write(`Nothing to stop. Use '${global.appName} start' command to start installation process and run all applications\n`);
    return;
  }

  const reversedAppsPool = appsPool.slice().reverse();
  for (let i = 0; i < reversedAppsPool.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await reversedAppsPool[i].stop();
  }
}

module.exports = stop;
