const path = require('path');
const fs = require('fs');
const tar = require('tar');
const os = require('os');
const axios = require('axios');
const crypto = require('crypto');
const rimraf = require('rimraf');
const stop = require('./control-stop');
const downloader = require('./downloader');
const ReleaseNotFound = require('./errors/release-not-found');
const getBinariesRelease = require('./install-binaries-release');

const platform = { win32: 'Windows', darwin: 'macOS', linux: 'Linux' }[os.platform()];
const releasesRegexp = new RegExp(`^release-${platform}-(?<release>(\\d+\\.\\d+.\\d+|latest))\\.tar\\.gz$`);

const releaseHashFilePith = path.join(global.appsPath, 'release.sha256');

function getDownloadUrl(assets, filter) {
  const asset = assets.filter(filter)[0];
  if (asset) {
    return asset.browser_download_url;
  }

  throw new Error('Release is not found');
}

function getNodeSeSupportedVersions(binariesRelease) {
  return binariesRelease.assets
    .map((asset) => releasesRegexp.exec(asset.name))
    .filter((regexp) => regexp)
    .map((regexp) => regexp.groups.release)
    .sort((a, b) => { if (a > b) return -1; if (b > a) return 1; return 0; });
}

async function getReleaseAssetDownloadUrls(binariesRelease) {
  try {
    const binDownloadUrl = getDownloadUrl(binariesRelease.assets, (asset) => asset.name === `release-${platform}-${global.nodeSeReleaseTag}.tar.gz`);
    const hashDownloadUrl = getDownloadUrl(binariesRelease.assets, (asset) => asset.name === `release-${platform}-${global.nodeSeReleaseTag}.tar.gz.sha256`);
    return { binaries: binDownloadUrl, hash: hashDownloadUrl };
  } catch (ex) {
    if (ex.message === 'Release is not found') {
      const availableReleases = getNodeSeSupportedVersions(binariesRelease);
      throw new ReleaseNotFound(global.nodeSeReleaseTag, availableReleases);
    }
    throw ex;
  }
}

async function getReleaseHashRemote(hashFileUrl) {
  const result = await axios({ url: hashFileUrl });
  return result.data.trim();
}

function getFileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

async function install() {
  const binariesRelease = await getBinariesRelease();
  const downloadUrls = await getReleaseAssetDownloadUrls(binariesRelease);
  const releaseFilePath = path.join(global.cachePath, path.basename(downloadUrls.binaries));

  if (!fs.existsSync(releaseFilePath)
   || (getFileHash(releaseFilePath) !== await getReleaseHashRemote(downloadUrls.hash))) {
    process.stdout.write(`Downloading ${downloadUrls.binaries}.. `);
    await downloader.getBinaryFile(downloadUrls.binaries, global.cachePath);
    process.stdout.write('Done\n');
  }

  const releaseHash = getFileHash(releaseFilePath);

  if (fs.existsSync(global.appsPath)
        && (!fs.existsSync(releaseHashFilePith)
        || fs.readFileSync(releaseHashFilePith).toString() !== releaseHash)) {
    process.stdout.write('New release package detected! Applying updates..\n');
    await stop();
    rimraf.sync(global.appsPath);
  }

  if (!fs.existsSync(global.appsPath)) {
    fs.mkdirSync(global.appsPath, { recursive: true });
    process.stdout.write(`Decompressing ${releaseFilePath}.. `);
    await tar.x({ file: releaseFilePath, C: global.appsPath });
    fs.writeFileSync(releaseHashFilePith, releaseHash);
    process.stdout.write('Done\n');
  }

  return {
    binariesRelease,
    nodeSeSupportedVersions: getNodeSeSupportedVersions(binariesRelease),
  };
}

module.exports = install;
