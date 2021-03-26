const path = require('path');
const fs = require('fs');
const { major: semverMajor } = require('semver');
const { Octokit } = require('@octokit/rest');
const { version: cliVersion } = require('../package.json');

const releaseCacheFile = path.join(global.cachePath, 'release.json');

async function getFromGitHub() {
  const repoOwnerAndName = global.githubBinariesRepository.split('/');
  const octokit = new Octokit();
  const { data: allReleases } = await octokit.repos.listReleases({
    owner: repoOwnerAndName[0],
    repo: repoOwnerAndName[1],
  });

  const releases = allReleases
    .filter((r) => semverMajor(r.tag_name) === semverMajor(cliVersion))
    .sort((a, b) => {
      if (a.tag_name > b.tag_name) return 1;
      if (b.tag_name > a.tag_name) return -1;
      return 0;
    });

  return releases[releases.length - 1];
}

function setToCache(release) {
  fs.writeFileSync(releaseCacheFile, JSON.stringify(release, null, 2));
}

function getFromCache() {
  if (!fs.existsSync(releaseCacheFile)) {
    throw Error('Local cache is not found. Connect your machine to the Internet to fix this problem!');
  }

  return JSON.parse(fs.readFileSync(releaseCacheFile).toString());
}

async function get() {
  try {
    const binariesAssets = await getFromGitHub();
    setToCache(binariesAssets);
    return binariesAssets;
  } catch (e) {
    // get caches assets because github api has a rate limit and may end unexpectable
    process.stdout.write(`Warn! GitHub API is unavalable(${e.message}).\n`);
    return getFromCache();
  }
}

module.exports = get;
