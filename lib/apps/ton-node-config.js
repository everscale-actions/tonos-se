const serviceName = 'ton-node';
const path = require('path');
const os = require('os');
const config = require('../app-config-base')(serviceName);

config.binPath = path.join(config.appPath, (os.platform() === 'win32' ? 'ton_node_startup.exe' : 'ton_node_startup'));
config.сreatePidFile = true;
config.paramsStart = ['--config', 'cfg.json', '--workdir', config.dataPath];
config.ports = [global.nodeSePort, global.nodeSeRequestsPort, global.nodeSeAdnlPort];

module.exports = config;
