#!/usr/bin/env node

const path = require('path');

require('../lib/global.js');
require('dotenv').config();
require('dotenv').config({ path: path.join(global.appRoot, '.env.settings') });

const commandLineArgs = require('command-line-args');
const control = require('../lib/control');
/* first - parse the main command */
const mainDefinitions = [
  { name: 'command', defaultOption: true },
];
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
// eslint-disable-next-line no-underscore-dangle
const argv = mainOptions._unknown || [];

async function main() {
  switch (mainOptions.command) {
    case 'start':
      await control.start();
      break;
    case 'stop':
      await control.stop();
      break;
    case 'reset':
      await control.reset();
      break;
    case 'status':
      await control.status();
      break;
    case 'config':
      // eslint-disable-next-line no-case-declarations
      const mergeDefinitions = [
        { name: 'nginx-port', type: Number },
        { name: 'arango-port', type: Number },
        { name: 'node-port', type: Number },
        { name: 'qserver-port', type: Number },
      ];

      // eslint-disable-next-line no-case-declarations
      const newSettings = commandLineArgs(mergeDefinitions, { argv });

      control.config(newSettings);
      break;
    default:
      break;
  }
}

(async () => { await main(); })();
