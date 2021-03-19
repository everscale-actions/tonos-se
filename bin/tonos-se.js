#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const control = require('../lib/tonos-se');
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
      // eslint-disable-next-line no-case-declarations
      const resetDefenitions = [
        { name: 'force', type: Boolean },
      ];

      await control.reset(commandLineArgs(resetDefenitions, { argv }).force);
      break;
    case 'restart':
      await control.restart();
      break;
    case 'status':
      await control.status();
      break;
    case 'config':
      // eslint-disable-next-line no-case-declarations
      const configDefenitions = [
        { name: 'nginx-port', type: Number },
        { name: 'arango-port', type: Number },
        { name: 'ton-node-port', type: Number },
        { name: 'q-server-port', type: Number },
        { name: 'ton-node-requests-port', type: Number },
        { name: 'node-release', type: String },
      ];

      // eslint-disable-next-line no-case-declarations
      const newSettings = commandLineArgs(configDefenitions, { argv });

      control.config(newSettings);
      break;
    default:
      break;
  }
}

(async () => { await main(); })();
