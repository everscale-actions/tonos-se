#!/usr/bin/env node

var args = process.argv.splice(process.execArgv.length + 2);

command = args[0];

switch (command) {
    case 'start':
        require("../lib/start.js").exec();
        break;
    case 'stop':
        require("../lib/stop.js").exec();
        break;
    default:
        break;
}