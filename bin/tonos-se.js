#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const boxen = require('boxen');
const PortsAlreadyInUseError = require('../lib/errors/ports-already-in-use');
const ReleaseNotFound = require('../lib/errors/release-not-found');
const tonos = require('../lib/tonos-se');

/* first - parse the main command */
const mainDefinitions = [
  { name: 'command', defaultOption: true },
];
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
// eslint-disable-next-line no-underscore-dangle
const argv = mainOptions._unknown || [];

function cj(json) {
  return JSON.stringify(json, null, 2);
}

async function main() {
  switch (mainOptions.command) {
    case 'help': {
      const sections = [
        {
          header: 'TONOS SE CLI',
          content: 'Easy install, configure and manage TON OS Startup Edition without Docker.',
        },
        {
          header: 'Synopsis',
          content: `$ ${global.appName} <command> <options>`,
        },
        {
          header: 'Command List',
          content: [
            { name: 'start | stop | restart', summary: 'Start, stop or restart necessary services.' },
            { name: 'config', summary: 'Show and configure listening ports and other options. Follow \'config options\' in this help section to get details.' },
            { name: 'reset', summary: 'Reset config parameters and remove internal applications without data files' },
            { name: 'remove', summary: 'Removing whole applications and data files.' },
            { name: 'status', summary: 'Display status.' },
            { name: 'version', summary: 'Display version of applications.' },
          ],
        },
        {
          header: 'config <options>',
          content: [
            { name: '--q-server-port', summary: 'Set listening port for Q-Server' },
            { name: '--nginx-port', summary: 'Set listening port for Nginx' },
            { name: '--ton-node-port', summary: 'Set listening port for Ton Node' },
            { name: '--ton-node-kafka-msg-port', summary: 'Set listening port for Ton Node Kafka' },
            { name: '--ton-node-adnl-port', summary: 'Set listening port for Ton Node ADNL' },
            { name: '--arango-port', summary: 'Set listening port for ArangoDB' },
            { name: '--tonos-se-version', summary: 'Set a version of TON OS SE' },
            { name: '--github-binaries-repository', summary: 'GitHub repository with binaries. Default: {underline ton-actions/tonos-se-binaries}' },
          ],
        },
        {
          content: 'Project home: {underline https://github.com/ton-actions/tonos-se}',
        },
      ];

      process.stdout.write(`${getUsage(sections)}\n`);
      break;
    }
    case 'start':
    case 'restart': {
      if (mainOptions.command === 'restart') {
        await tonos.stop();
      }
      try {
        await tonos.start();
      } catch (ex) {
        if (ex instanceof PortsAlreadyInUseError) {
          ex.statuses
            .forEach((ps) => process.stderr.write(`Service ${ps.serviceName} port ${ps.port} is already in use\n`));
          process.stderr.write(`Please change service port using command 'config <paramters>'. To get more details use '${global.appName} help'\n`);
          return;
        }
        if (ex instanceof ReleaseNotFound) {
          process.stderr.write(`${ex.message}\nUse '${global.appName} config --tonos-se-version <VERSION>' to fix the problem.\n`);
          return;
        }
        throw ex;
      }

      process.stdout.write(boxen(`GraphQL: http://localhost:${global.nginxPort}/graphql\nArangoDB: http://localhost:${global.arangoPort}\nApplication folder: ${global.appRoot}`, { padding: 1, margin: 1, borderStyle: 'double' }));
      break;
    }
    case 'stop':
      await tonos.stop();
      break;
    case 'reset': {
      await tonos.reset(false);
      break;
    }
    case 'remove': {
      await tonos.reset(true);
      break;
    }
    case 'status': {
      const statuses = await tonos.status();
      statuses.forEach((s) => {
        const statusText = s.isRunning ? `running. [PID:${s.pid} PORTS:${s.portStatuses.map((p) => p.port)}]` : 'stopped';
        process.stdout.write(`Service ${s.serviceName} is ${statusText}\n`);
      });

      break;
    }
    case 'config': {
      const configDefenitions = [
        { name: 'nginx-port', type: Number },
        { name: 'arango-port', type: Number },
        { name: 'ton-node-port', type: Number },
        { name: 'q-server-port', type: Number },
        { name: 'ton-node-kafka-msg-port', type: Number },
        { name: 'ton-node-adnl-port', type: Number },
        { name: 'tonos-se-version', type: String },
        { name: 'github-binaries-repository', type: String },
      ];

      // show current config
      const config = commandLineArgs(configDefenitions, { argv });
      if (Object.keys(config).length === 0) {
        process.stdout.write(`${cj(tonos.config.get())}\n`);
      } else {
        tonos.config.set(config);
      }
      break;
    }
    case 'version': {
      const version = await tonos.version();
      process.stdout.write(`${cj(version)}\n`);
      break;
    }
    default:
      process.stdout.write(`Unknown command. Use command '${global.appName} help' to list available commands\n`);
      break;
  }
}

(async () => {
  try {
    await main();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
  }
})();
