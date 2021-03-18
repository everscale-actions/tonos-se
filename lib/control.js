/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const rimraf = require('rimraf');
const { install } = require('./control-install');
const { setConfig } = require('./app-config');
const { appsPool } = require('../server-modules/appsPool');

async function start() {
  await install(); // create structure and download files if needed

  for (const app of appsPool) {
    await app.start();
  }
}

async function stop() {
  if (!fs.existsSync(global.appsPath)) {
    console.log(`Nothing to stop. Use '${global.appName} start' command to start installation process and run all applications`);
    return;
  }
  for (const app of appsPool.reverse()) {
    await app.stop();
  }
}

async function reset() {
  await stop();
  if (fs.existsSync(global.appsPath)) {
    rimraf.sync(global.appsPath);
  }
  await start();
}

async function status() {
  for (const app of appsPool) {
    process.stdout.write(await app.status());
  }
}

async function config(newSettings) {
  process.stdout.write(`Applying new configuration: ${JSON.stringify(newSettings)}\n`);
  setConfig(newSettings);
}

module.exports.start = start;
module.exports.stop = stop;
module.exports.reset = reset;
module.exports.status = status;
module.exports.config = config;
