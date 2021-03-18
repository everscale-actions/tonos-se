const path = require('path');
const fs = require('fs');
const settings = require('./settings');

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

const settingsConfig = settings.getConfig();

global.nginxPort = process.env.TONOS_SE_NGINX_PORT ?? settingsConfig['nginx-port'];
global.qServerPort = process.env.TONOS_SE_Q_PORT ?? settingsConfig['q-server-port'];
global.nodeSePort = process.env.TONOS_SE_NODESE_PORT ?? settingsConfig['ton-node-port'];
global.arangoPort = process.env.TONOS_SE_ARANGO_PORT ?? settingsConfig['arango-port'];
global.nodeSeReleaseTag = process.env.TONOS_RELEASE_TAG ?? settingsConfig['node-release'];
