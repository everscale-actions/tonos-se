const path = require('path');
const fs = require('fs');
const tar = require('tar');
const os = require('os');
const downloader = require('./downloader');

const cachePath = path.join(global.appRoot, '.cache');

function getOsByPlatform() {
  const osp = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
  };
  return osp[os.platform()];
}

const releaseUrl = `https://github.com/ton-actions/megogo-test/releases/download/${global.nodeSeReleaseTag}/release-${getOsByPlatform()}.tar.gz`;
const releaseFilePath = path.join(cachePath, path.basename(releaseUrl));

async function install() {
  if (!fs.existsSync(releaseFilePath)) {
    process.stdout.write(`Downloading ${releaseUrl}.. `);
    await downloader.getBinaryFile(releaseUrl, cachePath);
    process.stdout.write('Done\n');
  }

  if (!fs.existsSync(global.appsPath)) {
    fs.mkdirSync(global.appsPath, { recursive: true });
    process.stdout.write(`Decompressing ${releaseFilePath}.. `);
    await tar.x({ file: releaseFilePath, C: global.appsPath });

    // copying addintional files
    fs.mkdirSync(global.dataPath, { recursive: true });
    process.stdout.write('Done\n');
  }
}

module.exports.install = install;
