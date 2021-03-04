#!/usr/bin/env node

var args = process.argv.splice(process.execArgv.length + 2);

command = args[0];

const path = require('path');
global.appRoot = path.join(path.resolve(__dirname),"..");

switch (command) {
    case 'start':
        require("../lib/nginx/start.js").exec();
        break;
    case 'stop':
        require("../lib/nginx/stop.js").exec();
        break;
    default:
        break;
}