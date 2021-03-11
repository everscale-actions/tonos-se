#!/usr/bin/env node

require('dotenv').config();
const path = require('path');
const managment = require('../lib/serverManagement/management');

const args = process.argv.splice(process.execArgv.length + 2);
const command = args[0];

global.appRoot = path.join(path.resolve(__dirname), '..');
global.serverPath = path.join(global.appRoot, '.server');
global.appsPath = path.join(global.serverPath, 'apps');
global.cachePath = path.join(global.serverPath, 'cache');
global.dataPath = path.join(global.serverPath, 'data');
global.logsPath = path.join(global.serverPath, 'logs');

switch (command) {
  case 'start':
    managment.start();
    break;
  case 'stop':
    managment.stop();
    break;
  default:
    break;
}
