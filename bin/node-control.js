#!/usr/bin/env node

const path = require('path');

require('../lib/global.js');
require('dotenv').config();
require('dotenv').config({ path: path.join(global.appRoot, '.env.settings') });

const management = require('../lib/control');

const args = process.argv.splice(process.execArgv.length + 2);
const command = args[0];

switch (command) {
  case 'start':
    management.start();
    break;
  case 'stop':
    management.stop();
    break;
  default:
    break;
}
