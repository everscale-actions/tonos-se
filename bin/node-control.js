#!/usr/bin/env node

const path = require('path');

require('../lib/global.js');
require('dotenv').config();
require('dotenv').config({ path: path.join(global.appRoot, '.env.settings') });

const management = require('../lib/control');

const args = process.argv.splice(process.execArgv.length + 2);
const command = args[0];

async function main() {
  switch (command) {
    case 'start':
      await management.start();
      break;
    case 'stop':
      await management.stop();
      break;
    case 'reset':
      await management.reset();
      break;
    case 'status':
      await management.status();
      break;
    default:
      break;
  }
}

(async () => {
  try {
    await main();
  } catch (e) {
    process.stderr.write(`Critical error: ${e}`);
  }
})();
