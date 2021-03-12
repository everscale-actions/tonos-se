#!/usr/bin/env node

require('dotenv').config();
require('../lib/global.js');

const managment = require('../lib/serverManagement/management');

const args = process.argv.splice(process.execArgv.length + 2);
const command = args[0];

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
