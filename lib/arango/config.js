const path = require('path');
const os = require('os');

exports.getConfig = () => ({
  appPath: path.join(global.appsPath, 'arango'),
  binPath: path.join(global.appsPath, 'arango', 'usr', 'sbin', 'arangod') + (os.platform() === 'win32' ? '.exe' : ''),
  pidFilePath: path.join(global.dataPath, 'arango.pid'),
});
