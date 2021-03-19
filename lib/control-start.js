const install = require('./control-start-install');
const transform = require('./control-start-transform');
const appsPool = require('./apps/apps-pool');

async function start() {
  await install(); // create structure and download files if needed

  for (let i = 0; i < Object.keys(appsPool).length; i += 1) {
    const app = Object.values(appsPool)[i];
    if (app.prepare) app.prepare();
  }

  transform();

  for (let i = 0; i < Object.keys(appsPool).length; i += 1) {
    const app = Object.values(appsPool)[i];
    await app.start();
  }
}

module.exports = start;
