const path = require('path');
const fs = require('fs');
const tar = require('tar');
const rimraf = require('rimraf');
const { config } = require('./config');
const downloader = require('./downloader');
const nginx = require('./nginx/module');
const arango = require('./arango/module');
const tonNode = require('./ton-node/module');
const qServer = require('./q-server/module');

const appsPool = [nginx, arango, tonNode, qServer];

async function install() {
  try {
    const releaseFilePath = path.join(global.cachePath, path.basename(config.releaseUrl));

    if (!fs.existsSync(global.dataPath)) { fs.mkdirSync(global.dataPath); }

    if (!fs.existsSync(releaseFilePath)) {
      console.log(`Downloading ${config.releaseUrl}`);
      await downloader.getBinaryFile(config.releaseUrl, global.cachePath);
    }

    if (!fs.existsSync(global.appsPath)) {
      fs.mkdirSync(global.appsPath, { recursive: true });
      console.log(`Decompressing ${releaseFilePath}...`);
      await tar.x({ file: releaseFilePath, C: global.appsPath });
    }
  } catch (err) {
    console.log(err.message);
  }
}

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
  process.stdout.write(await nginx.status());
  process.stdout.write(await arango.status());
  process.stdout.write(await tonNode.status());
  process.stdout.write(await qServer.status());
}

module.exports.start = start;
module.exports.stop = stop;
module.exports.reset = reset;
module.exports.status = status;
