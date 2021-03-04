#!/usr/bin/env node

var args = process.argv.splice(process.execArgv.length + 2);

command = args[0];

const path = require('path');
global.appRoot = path.join(path.resolve(__dirname),"..");

switch (command) {
    case 'start':
        require("../lib/nginx/serviceControl.js").start();
        require("../lib/arango/serviceControl.js").start();
        break;
    case 'stop':
        require("../lib/nginx/serviceControl.js").stop();
        //require("../lib/arango/serviceControl.js").stop();
        break;
    default:
        break;
}