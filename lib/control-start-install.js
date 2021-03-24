const path = require('path');
const fs = require('fs');
const tar = require('tar');
const os = require('os');
const axios = require('axios');
const crypto = require('crypto');
const rimraf = require('rimraf');
const { Octokit } = require('@octokit/rest');
const stop = require('./control-stop');
const downloader = require('./downloader');
const ReleaseNotFound = require('./errors/release-not-found');

const platform = { win32: 'Windows', darwin: 'macOS', linux: 'Linux' }[os.platform()];
const releasesRegexp = new RegExp(`^release-${platform}-(?<release>\\d+\\.\\d+.\\d+)\\.tar\\.gz$`);

const assetsCacheFile = path.join(global.cachePath, 'assets.json');
const releaseHashFilePith = path.join(global.appsPath, 'release.sha256');

function getDownloadUrl(assets, filter) {
  const asset = assets.filter(filter)[0];
  if (asset) {
    return asset.browser_download_url;
  }

  throw new Error('Release is not found');
}

async function getGithubAssets() {
  const repoOwnerAndName = global.githubBinariesRepository.toString().split('/');
  const octokit = new Octokit();
  const { data: allReleases } = await octokit.repos.listReleases({
    owner: repoOwnerAndName[0],
    repo: repoOwnerAndName[1],
  });

  const releases = allReleases.filter((r) => r.tag_name.startsWith(`v${global.binariesVersion}.`))
    .sort((a, b) => {
      if (a.tag_name > b.tag_name) return 1;
      if (b.tag_name > a.tag_name) return -1;
      return 0;
    });

  return releases[releases.length - 1].assets;
}

function setCachedAssets(assets) {
  fs.mkdirSync(global.cachePath, { recursive: true });
  fs.writeFileSync(assetsCacheFile, JSON.stringify(assets, null, 2));
}

function getCachedAssets() {
  return JSON.parse(fs.readFileSync(assetsCacheFile).toString());
}

async function getReleaseAssetDownloadUrls() {
  let binariesAssets;
  try {
    binariesAssets = await getGithubAssets();
    setCachedAssets(binariesAssets);
  } catch {
    // get caches assets because github api has a rate limit and may end unexpectable
    process.stdout.write('Warn! Used cached assets due to GitHub API is unavalable.\n');
    binariesAssets = getCachedAssets();
  }

  try {
    const binDownloadUrl = getDownloadUrl(binariesAssets, (asset) => asset.name === `release-${platform}-${global.nodeSeReleaseTag}.tar.gz`);
    const hashDownloadUrl = getDownloadUrl(binariesAssets, (asset) => asset.name === `release-${platform}-${global.nodeSeReleaseTag}.tar.gz.sha256`);
    return { binaries: binDownloadUrl, hash: hashDownloadUrl };
  } catch (ex) {
    if (ex.message === 'Release is not found') {
      const availableReleases = binariesAssets
        .map((asset) => releasesRegexp.exec(asset.name))
        .filter((regexp) => regexp)
        .map((regexp) => regexp.groups.release);
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
  const downloadUrls = await getReleaseAssetDownloadUrls();
  const releaseFilePath = path.join(global.cachePath, path.basename(downloadUrls.binaries));

  if (!fs.existsSync(releaseFilePath)
   || (getFileHash(releaseFilePath) !== await getReleaseHashRemote(downloadUrls.hash))) {
    process.stdout.write(`Downloading ${downloadUrls.binaries}.. `);
    await downloader.getBinaryFile(downloadUrls.binaries, global.cachePath);
    process.stdout.write('Done\n');
  }

  const releaseHash = getFileHash(releaseFilePath);

  if (!fs.existsSync(releaseHashFilePith)
  || fs.readFileSync(releaseHashFilePith).toString() !== releaseHash) {
    process.stdout.write('New release package detected! Stopping apps and applying updates..\n');
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
}

module.exports = install;
