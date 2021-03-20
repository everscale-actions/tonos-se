const path = require('path');
const fs = require('fs');
const tar = require('tar');
const os = require('os');
const axios = require('axios');
const crypto = require('crypto');
const rimraf = require('rimraf');
const stop = require('./control-stop');
const downloader = require('./downloader');

const binariesRepo = 'ton-actions/megogo-test';

const cachePath = path.join(global.appRoot, '.cache');

function getOsByPlatform() {
  const osp = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
  };
  return osp[os.platform()];
}

const releaseUrl = `https://github.com/${binariesRepo}/releases/download/${global.nodeSeReleaseTag}/release-${getOsByPlatform()}.tar.gz`;
const sha1Url = `https://github.com/${binariesRepo}/releases/download/${global.nodeSeReleaseTag}/release-${getOsByPlatform()}.tar.gz.sha256`;
const releaseFilePath = path.join(cachePath, path.basename(releaseUrl));

async function getReleaseHashRemote() {
  const result = await axios({ url: sha1Url });
  return result.data.trim();
}

function getReleaseHashLocal() {
  return crypto.createHash('sha256').update(fs.readFileSync(releaseFilePath)).digest('hex');
}

async function install() {
  if (!fs.existsSync(releaseFilePath) || (getReleaseHashLocal() !== await getReleaseHashRemote())) {
    if (fs.existsSync(global.appsPath)) {
      process.stdout.write('New release package detected! Stopping apps and applying updates..\n');
      await stop();
      rimraf.sync(global.appsPath);
    }

    process.stdout.write(`Downloading ${releaseUrl}.. `);
    await downloader.getBinaryFile(releaseUrl, cachePath);
    process.stdout.write('Done\n');

    fs.mkdirSync(global.appsPath, { recursive: true });
    process.stdout.write(`Decompressing ${releaseFilePath}.. `);
    await tar.x({ file: releaseFilePath, C: global.appsPath });

    // copying addintional files
    fs.mkdirSync(global.dataPath, { recursive: true });
    process.stdout.write('Done\n');
  }
}

module.exports = install;
