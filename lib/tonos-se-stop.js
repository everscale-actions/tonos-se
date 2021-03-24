const fs = require('fs');
const appsPool = require('./apps/apps-pool');

async function stop() {
  if (!fs.existsSync(global.appsPath)) {
    console.log(`Nothing to stop. Use '${global.appName} start' command to start installation process and run all applications`);
    return;
  }

  const reversedAppsPool = appsPool.slice().reverse();
  for (let i = 0; i < Object.keys(reversedAppsPool).length; i += 1) {
    const app = Object.values(reversedAppsPool)[i];
    await app.stop();
  }
}

module.exports = stop;
