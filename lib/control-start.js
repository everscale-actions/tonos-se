const install = require('./control-start-install');
const appsPool = require('./apps/apps-pool');

async function startApps() {
  for (let i = 0; i < appsPool.length; i += 1) {
    const app = appsPool[i];
    await app.start();
  }
}

async function start() {
  await install(); // create structure and download files if needed

  await startApps();
}

module.exports = start;
