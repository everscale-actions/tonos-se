#!/usr/bin/env node

require('dotenv').config()
var args = process.argv.splice(process.execArgv.length + 2);

command = args[0];

const path = require('path');
global.appRoot = path.join(path.resolve(__dirname),"..");
global.serverPath = path.join(appRoot,".server");
global.appsPath = path.join(serverPath,"apps");
global.cachePath = path.join(serverPath,"cache");
global.dataPath = path.join(serverPath,"data");
global.logsPath = path.join(serverPath,"logs");

switch (command) {
    case 'start':
        require("../lib/serverManagement/management").start();
        break;
    case 'stop':
        require("../lib/serverManagement/management").stop();
        break;
    default:
        break;
}