const fs = require('fs');
const rimraf = require('rimraf');
const nginx = require('./nginx/module');
const arango = require('./arango/module');
const tonNode = require('./ton-node/module');
const qServer = require('./q-server/module');
const { install } = require('./control-install');

const appsPool = [nginx, arango, tonNode, qServer];

async function start() {
  await install(); // create structure and download files if needed

  appsPool.map((app) => app.start());
}
async function stop() {
  if (!fs.existsSync(global.appsPath)) {
    console.log(`Nothing to stop. Use '${global.appName} start' command to start installation process and run all applications`);
    return;
  }
  appsPool.map((app) => app.stop());
}

async function reset() {
  await stop();
  if (fs.existsSync(global.appsPath)) {
    rimraf.sync(global.appsPath);
  }
  await start();
}

async function status() {
  appsPool.map(async (app) => process.stdout.write(await app.status()));
}

module.exports.start = start;
module.exports.stop = stop;
module.exports.reset = reset;
module.exports.status = status;
