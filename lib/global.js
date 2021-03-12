const path = require('path');

global.appRoot = path.join(path.resolve(__dirname), '..');
global.serverPath = path.join(global.appRoot, '.server');
global.appsPath = path.join(global.serverPath, 'apps');
global.cachePath = path.join(global.serverPath, 'cache');
global.dataPath = path.join(global.serverPath, 'data');
global.logsPath = path.join(global.serverPath, 'logs');
