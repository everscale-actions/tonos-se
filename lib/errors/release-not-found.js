const util = require('util');

function ReleaseNotFound(nonExistentRelease, availableReleases) {
  this.message = `Release ${nonExistentRelease} is not found. Avalible releases: ${availableReleases.join(', ')}`;
  this.availableReleases = availableReleases;
  Error.captureStackTrace(this);
}

util.inherits(ReleaseNotFound, Error);
ReleaseNotFound.prototype.name = 'ReleaseNotFound';

module.exports = ReleaseNotFound;
