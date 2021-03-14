const path = require('path');

global.appRoot = path.join(path.resolve(__dirname), '..');
global.serverPath = path.join(global.appRoot, '.server');
global.cachePath = path.join(global.appRoot, '.cache');
global.appsPath = path.join(global.serverPath, 'apps');
global.dataPath = path.join(global.serverPath, 'data');
global.logsPath = path.join(global.serverPath, 'logs');
