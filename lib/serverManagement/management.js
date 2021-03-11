const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const decompress = require('decompress');
const moduleConfig = require('./config').getConfig();
const downloader = require('./downloader');
const serviceControl = require('../nginx/serviceControl');

async function install() {
  try {
    const releaseFilePath = path.join(global.cachePath, path.basename(moduleConfig.releaseUrl));

    if (!fs.existsSync(global.dataPath)) { fs.mkdirSync(global.dataPath); }
    if (!fs.existsSync(global.logsPath)) { fs.mkdirSync(global.logsPath); }

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

async function runApp(binPath, binParams, workDir) {
  if (!fs.existsSync(workDir)) { fs.mkdirSync(workDir); }
  const process = spawn(binPath, binParams, { cwd: workDir, detached: true, stdio: 'ignore' });

  process.on('error', (err) => console.error(`Nginx received error: ${err.message}`));

  process.unref();
}

async function start() {
  await install(); // create structure and download files if needed
  await serviceControl.start();
}
async function stop() {
  await install(); // create structure and download files if needed
  await serviceControl.stop();
}

module.exports.runApp = runApp;
module.exports.start = start;
module.exports.stop = stop;
