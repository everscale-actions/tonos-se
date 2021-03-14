const path = require('path');
const fs = require('fs');
const tar = require('tar');
const { config } = require('./config');
const downloader = require('./downloader');

const releaseFilePath = path.join(global.cachePath, path.basename(config.releaseUrl));

async function install() {
  if (!fs.existsSync(releaseFilePath)) {
    process.stdout.write(`Downloading ${config.releaseUrl}.. `);
    await downloader.getBinaryFile(config.releaseUrl, global.cachePath);
    process.stdout.write('Done\n');
  }

  if (!fs.existsSync(global.appsPath)) {
    fs.mkdirSync(global.appsPath, { recursive: true });
    process.stdout.write(`Decompressing ${releaseFilePath}.. `);
    await tar.x({ file: releaseFilePath, C: global.appsPath });
    process.stdout.write('Done\n');
  }
}

module.exports.install = install;
