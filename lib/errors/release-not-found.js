const util = require('util');

function ReleaseNotFound(nonExistentRelease, availableReleases) {
  this.message = `Current version '${nonExistentRelease}' is not found. Available versions: ${availableReleases.join(', ')}. `;
  this.availableReleases = availableReleases;
  Error.captureStackTrace(this);
}

util.inherits(ReleaseNotFound, Error);
ReleaseNotFound.prototype.name = 'ReleaseNotFound';

module.exports = ReleaseNotFound;
