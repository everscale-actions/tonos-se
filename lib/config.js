const os = require('os');

function getOsByPlatform() {
  const osp = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
  };
  return osp[os.platform()];
}

exports.getConfig = () => ({
  releaseUrl: `https://github.com/ton-actions/node-se-binaries/releases/download/${process.env.NODESE_RELEASE_TAG}/release-${getOsByPlatform()}.tar.gz`,
});