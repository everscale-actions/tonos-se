const path = require('path');
const fs = require('fs');
const tar = require('tar');
const os = require('os');
const downloader = require('./downloader');

function getOsByPlatform() {
  const osp = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
  };
  return osp[os.platform()];
}

const releaseUrl = `https://github.com/ton-actions/megogo-test/releases/download/${process.env.NODESE_RELEASE_TAG}/release-${getOsByPlatform()}.tar.gz`;
const releaseFilePath = path.join(global.cachePath, path.basename(releaseUrl));

async function install() {
  if (!fs.existsSync(releaseFilePath)) {
    process.stdout.write(`Downloading ${releaseUrl}.. `);
    await downloader.getBinaryFile(releaseUrl, global.cachePath);
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
