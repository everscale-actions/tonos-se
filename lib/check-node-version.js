const semver = require('semver');
const nodeVersion = require('../package.json').engines.node;

if (!semver.satisfies(process.version, nodeVersion)) {
  // Strip version range characters leaving the raw semantic version for output
  const rawVersion = nodeVersion.replace(/[^\d.]*/, '');
  const message = `${global.appName} requires at least Node v${rawVersion}. `
  + `You have ${process.version}.\n`
  + 'See https://github.com/ton-actions/tonos-se '
  + 'for details.\n';
  throw Error(message);
}
