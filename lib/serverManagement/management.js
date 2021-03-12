const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const decompress = require('decompress');
const process = require('process');
const moduleConfig = require('./config').getConfig();
const downloader = require('./downloader');
const nginx = require('../nginx/nginx');
const arango = require('../arango/arango');

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

function runApp(binPath, binParams, workDir, pidFilePath) {
  if (!fs.existsSync(workDir)) { fs.mkdirSync(workDir); }
  const proc = spawn(binPath, binParams, { cwd: workDir, detached: true, stdio: ['ignore', 'ignore', process.stdout] });

  console.log(`${binPath} ${binParams.join(' ')}`);

  process.on('error', (err) => console.error(`${err.message}`));
  await proc.unref();

  if (pidFilePath) { fs.writeFileSync(pidFilePath, proc.pid.toString()); }

  return proc.pid.toString();
}

async function start() {
  await install(); // create structure and download files if needed
  nginx.start();
  arango.start();
}
async function stop() {
  await install(); // create structure and download files if needed
  nginx.stop();
  arango.stop();
}

module.exports.runApp = runApp;
module.exports.start = start;
module.exports.stop = stop;
