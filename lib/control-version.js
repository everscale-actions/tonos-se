const appsPool = require('./apps/apps-pool');
const install = require('./install');

async function version() {
  const { binariesRelease, tonosSeAvailableVersions } = await install();
  const appVersions = await Promise.all(appsPool.map((app) => app.version()));

  const apps = {};
  appVersions.forEach((app) => { apps[app.app] = app.version; });

  return {
    cli: global.cliVersion,
    binaries: `${binariesRelease.name} (${binariesRelease.html_url})`,
    apps,
    'tonos-se-available-versions': tonosSeAvailableVersions,
  };
}

module.exports = version;
