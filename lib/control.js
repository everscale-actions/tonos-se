/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const rimraf = require('rimraf');
const install = require('./control-install');
const { setConfig } = require('./settings');
const appsPool = require('./apps/apps-pool');
const transform = require('./control-transform');

async function start() {
  await install(); // create structure and download files if needed

  for (const app of appsPool) {
    if (app.prepare) app.prepare();
  }

  transform();

  for (const app of appsPool) {
    await app.start();
  }
}

async function stop() {
  if (!fs.existsSync(global.appsPath)) {
    console.log(`Nothing to stop. Use '${global.appName} start' command to start installation process and run all applications`);
    return;
  }
  for (const app of appsPool.slice().reverse()) {
    await app.stop();
  }
}

async function reset(force) {
  await stop();
  if (force) {
    if (fs.existsSync(global.serverPath)) {
      rimraf.sync(global.serverPath);
    }
  } else if (fs.existsSync(global.appsPath)) {
    rimraf.sync(global.appsPath);
  }

  await start();
}

async function restart() {
  await stop();
  await start();
}

async function status() {
  for (const app of appsPool) {
    process.stdout.write(await app.status());
  }
}

async function config(newSettings) {
  // process.stdout.write(`Applying new configuration: ${JSON.stringify(newSettings)}\n`);
  setConfig(newSettings);
}

module.exports.start = start;
module.exports.stop = stop;
module.exports.reset = reset;
module.exports.restart = restart;
module.exports.status = status;
module.exports.config = config;
