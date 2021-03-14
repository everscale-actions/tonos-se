const path = require('path');
const fs = require('fs');
const tar = require('tar');
const rimraf = require('rimraf');
const isRunning = require('is-running');
const config = require('./config').getConfig();
const downloader = require('./downloader');
const nginx = require('./nginx/module');
const arango = require('./arango/module');
const tonNode = require('./ton-node/module');
const qServer = require('./q-server/module');

async function getServiceStatus(pidFilePath) {
  if (!fs.existsSync(pidFilePath)) { return false; }
  const pid = fs.readFileSync(pidFilePath, 'utf8').trim();
  if (!isRunning(pid)) { console.log(`It looks like the process (PID: ${pid}) does not exist. Try to use 'ton-node stop' and then 'ton-node start' command to fix the problem`); }
  return isRunning(pid) ? pid : 0;
}

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
  nginx.start();
  arango.start();
  tonNode.start();
  qServer.start();
}
async function stop() {
  if (!fs.existsSync(global.appsPath)) {
    console.log(`Nothing to stop. Use '${global.appName} start' command to start installation process and run all applications`);
    return;
  }
  nginx.stop();
  arango.stop();
  tonNode.stop();
  qServer.stop();
}

async function reset() {
  await stop();
  if (fs.existsSync(global.appsPath)) {
    rimraf.sync(global.appsPath);
  }
  start();
}

async function status() {
  let pid = await getServiceStatus(nginx.config.pidFilePath);
  console.log(`nginx - ${(pid ? (`running. Pid: ${pid}`) : 'stopped')}`);
  pid = await getServiceStatus(arango.config.pidFilePath);
  console.log(`arango - ${(pid ? (`running. Pid: ${pid}`) : 'stopped')}`);
  pid = await getServiceStatus(qServer.config.pidFilePath);
  console.log(`qserver - ${(pid ? (`running. Pid: ${pid}`) : 'stopped')}`);
  pid = await getServiceStatus(tonNode.config.pidFilePath);
  console.log(`qserver - ${(pid ? (`running. Pid: ${pid}`) : 'stopped')}`);
}

module.exports.start = start;
module.exports.stop = stop;
module.exports.reset = reset;
module.exports.status = status;
