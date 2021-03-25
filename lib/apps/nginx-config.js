const serviceName = 'nginx';
const path = require('path');
const os = require('os');
const config = require('../app-config-base')(serviceName);

config.binPath = path.join(config.appPath, 'nginx') + (os.platform() === 'win32' ? '.exe' : '');
config.paramsStart = ['-c', `${path.join(config.dataPath, 'nginx.conf')}`];
config.paramsStop = ['-c', `${path.join(config.dataPath, 'nginx.conf')}`, '-s', 'stop'];
config.ports = [global.nginxPort];

module.exports = config;
