const path = require('path');
const fs = require('fs');

global.appRoot = path.join(path.resolve(__dirname), '..');

const packageJson = JSON.parse(fs.readFileSync(path.join(global.appRoot, 'package.json'), 'utf8'));

// eslint-disable-next-line prefer-destructuring
global.appName = Object.keys(packageJson.bin)[0];
global.serverPath = path.join(global.appRoot, '.server');
global.cachePath = path.join(global.appRoot, '.cache');
global.appsPath = path.join(global.serverPath, 'apps');
global.dataPath = path.join(global.serverPath, 'data');
global.logsPath = path.join(global.serverPath, 'logs');
global.settingsFilePath = path.join(global.dataPath, 'settings.json');
global.envFilePath = path.join(global.dataPath, '.env');
