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
        //check if .server exists
        require("../lib/serverManagement/installer").install();
        break;
    case 'stop':
        //require("../lib/nginx/serviceControl.js").stop();
        //require("../lib/arango/serviceControl.js").stop();
        break;
    default:
        break;
}