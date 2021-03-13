const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const decompress = require('decompress');
const moduleConfig = require('./config').getConfig();
const downloader = require('./downloader');
const nginx = require('../nginx/nginx');
const arango = require('../arango/arango');
const tonNode = require('../ton-node/ton-node');
const qServer = require('../q-server/q-server');

async function install() {
  try {
    const releaseFilePath = path.join(global.cachePath, path.basename(moduleConfig.releaseUrl));

    if (!fs.existsSync(global.dataPath)) { fs.mkdirSync(global.dataPath); }

    if (!fs.existsSync(releaseFilePath)) {
      console.log(`Downloading ${moduleConfig.releaseUrl}`);
      await downloader.getBinaryFile(moduleConfig.releaseUrl, global.cachePath);
    }

    if (!fs.existsSync(global.appsPath)) {
      console.log(`Decompressing ${releaseFilePath}`);
      await decompress(releaseFilePath, global.appsPath);
    }
  } catch (err) {
    console.log(err.message);
  }
}

function runApp(binPath, binParams, workDir, pidFilePath, outFile, errFile) {
  if (!fs.existsSync(workDir)) { fs.mkdirSync(workDir); }

  const logStream = outFile ? fs.openSync(outFile, 'w') : 'ignore';
  const errStream = errFile ? fs.openSync(errFile, 'w') : 'ignore';
  console.debug(`Starting process: ${binPath} ${binParams.join(' ')}`);
  const process = spawn(binPath, binParams, { cwd: workDir, detached: true, stdio: ['ignore', logStream, errStream] });
  process.unref();
  if (pidFilePath) { fs.writeFileSync(pidFilePath, process.pid.toString()); }

  return process.pid.toString();
}

async function start() {
  await install(); // create structure and download files if needed
  nginx.start();
  arango.start();
  tonNode.start();
  qServer.start();
}
async function stop() {
  await install(); // create structure and download files if needed
  nginx.stop();
  arango.stop();
  tonNode.stop();
  qServer.stop();
}

module.exports.runApp = runApp;
module.exports.start = start;
module.exports.stop = stop;
