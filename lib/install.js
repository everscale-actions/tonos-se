const path = require('path');
const fs = require('fs');
const tar = require('tar');
const os = require('os');
const axios = require('axios');
const crypto = require('crypto');
const rimraf = require('rimraf');
const stop = require('./tonos-se-stop');
const downloader = require('./downloader');
const ReleaseNotFound = require('./errors/release-not-found');
const getBinariesRelease = require('./install-binaries-release');

const releasePrefix = 'tonos-se';

const platform = { win32: 'Windows', darwin: 'macOS', linux: 'Linux' }[os.platform()];
const releasesRegexp = new RegExp(`^${releasePrefix}-${platform}-(?<release>(\\d+\\.\\d+.\\d+|latest))\\.tar\\.gz$`);

const releaseHashFilePith = path.join(global.appsPath, 'release.sha256');

function getDownloadUrl(assets, filter) {
  const asset = assets.filter(filter)[0];
  if (asset) {
    return asset.browser_download_url;
  }

  throw new Error('Release is not found');
}

function getTonOsSeAvailableVersions(binariesRelease) {
  return binariesRelease.assets
    .map((asset) => releasesRegexp.exec(asset.name))
    .filter((regexp) => regexp)
    .map((regexp) => regexp.groups.release)
    .sort((a, b) => { if (a > b) return -1; if (b > a) return 1; return 0; });
}

async function getReleaseAssetDownloadUrls(binariesRelease) {
  try {
    const binDownloadUrl = getDownloadUrl(binariesRelease.assets, (asset) => asset.name === `${releasePrefix}-${platform}-${global.nodeSeReleaseTag}.tar.gz`);
    const hashDownloadUrl = getDownloadUrl(binariesRelease.assets, (asset) => asset.name === `${releasePrefix}-${platform}-${global.nodeSeReleaseTag}.tar.gz.sha256`);
    return { binaries: binDownloadUrl, hash: hashDownloadUrl };
  } catch (ex) {
    if (ex.message === 'Release is not found') {
      const availableReleases = getTonOsSeAvailableVersions(binariesRelease);
      throw new ReleaseNotFound(global.nodeSeReleaseTag, availableReleases);
    }
    throw ex;
  }
}

function getFileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

async function isRemoteHashChanged(releaseFilePath, hashDownloadUrl) {
  if (!fs.existsSync(releaseFilePath)) {
    return true;
  }
  const localHash = getFileHash(releaseFilePath);
  try {
    const result = await axios({ url: hashDownloadUrl });
    const remoteHash = result.data.trim();
    return (localHash !== remoteHash);
  } catch {
    process.stdout.write(`Remote hash ${hashDownloadUrl} is unavailable! Skip hash checking.. `);
    return false;
  }
}

async function install() {
  // get binaries release info from github and compose urls to download archive and hash files
  const binariesRelease = await getBinariesRelease();
  const downloadUrls = await getReleaseAssetDownloadUrls(binariesRelease);
  const releaseFilePath = path.join(global.cachePath, path.basename(downloadUrls.binaries));

  // ensure that local binaries arhive hash is the same as remote hash
  process.stdout.write('* Verifying checksum.. ');
  const remoteHashChanged = await isRemoteHashChanged(releaseFilePath, downloadUrls.hash);
  process.stdout.write('Done\n');

  // download new binaries if hash changed
  if (remoteHashChanged) {
    await downloader.getBinaryFile(downloadUrls.binaries, global.cachePath);
  }

  // drop apps dir if hash changed
  const releaseHash = getFileHash(releaseFilePath);
  if (fs.existsSync(global.appsPath)
        && (!fs.existsSync(releaseHashFilePith)
        || fs.readFileSync(releaseHashFilePith).toString() !== releaseHash)) {
    process.stdout.write('* Binary package has been changed! Applying updates..\n');
    await stop();
    rimraf.sync(global.appsPath);
  }

  // unzip apps
  if (!fs.existsSync(global.appsPath)) {
    fs.mkdirSync(global.appsPath);
    process.stdout.write(`* Decompressing ${path.basename(releaseFilePath)}.. `);
    await tar.x({ file: releaseFilePath, C: global.appsPath });
    fs.writeFileSync(releaseHashFilePith, releaseHash);
    process.stdout.write('Done\n');
  }

  // return info about used binaries release and available tonos se versions in assets
  return {
    binariesRelease,
    tonosSeAvailableVersions: getTonOsSeAvailableVersions(binariesRelease),
  };
}

module.exports = install;
