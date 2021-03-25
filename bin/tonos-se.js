#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const boxen = require('boxen');
const cj = require('color-json');
const semver = require('semver');
const control = require('../lib/tonos-se');
const PortsAlreadyInUseError = require('../lib/errors/ports-already-in-use');
const ReleaseNotFound = require('../lib/errors/release-not-found');
const nodeVersion = require('../package.json').engines.node;

if (!semver.satisfies(process.version, nodeVersion)) {
  // Strip version range characters leaving the raw semantic version for output
  const rawVersion = nodeVersion.replace(/[^\d.]*/, '');
  process.stderr.write(
    `${global.appName} requires at least Node v${rawVersion}. `
      + `You have ${process.version}.\n`
      + 'See https://github.com/ton-actions/tonos-se '
      + 'for details.\n',
  );
  process.exit(1);
}

/* first - parse the main command */
const mainDefinitions = [
  { name: 'command', defaultOption: true },
];
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
// eslint-disable-next-line no-underscore-dangle
const argv = mainOptions._unknown || [];

async function main() {
  switch (mainOptions.command) {
    case 'help':

      // eslint-disable-next-line no-case-declarations
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
            { name: 'reset', summary: 'Soft remove internal applications without data files. Use --hard option for removing whole applications and data files.' },
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
            { name: '--ton-node-requests-port', summary: 'Set listening port for Ton Node Kafka' },
            { name: '--arango-port', summary: 'Set listening port for ArangoDB' },
            { name: '--tonos-se-version', summary: 'Set a version of TON OS SE' },
            { name: '--github-binaries-repository', summary: 'GitHub repository with binaries. Default: {underline ton-actions/tonos-se-binaries}' },
          ],
        },
        {
          content: 'Project home: {underline https://github.com/ton-actions/tonos-se}',
        },
      ];

      console.log(getUsage(sections));
      break;

    case 'start':
    case 'restart':
      if (mainOptions.command === 'restart') {
        await control.stop();
      }
      try {
        await control.start();
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

      process.stdout.write(boxen(`GraphQL: http://localhost:${global.nginxPort}/graphql\nArangoDB: http://localhost:${global.arangoPort}\nServer folder: ${global.serverPath}`, { padding: 1, margin: 1, borderStyle: 'double' }));
      break;
    case 'stop':
      await control.stop();
      break;
    case 'reset':
      // eslint-disable-next-line no-case-declarations
      const resetDefenitions = [
        { name: 'hard', type: Boolean },
      ];
      await control.reset(commandLineArgs(resetDefenitions, { argv }).hard);
      break;
    case 'status':
      // eslint-disable-next-line no-case-declarations
      const statuses = await control.status();

      statuses.forEach((s) => {
        const statusText = s.isRunning ? `running. [PID: ${s.pid}]` : 'stopped';
        process.stdout.write(`Service ${s.serviceName} is ${statusText}\n`);
      });

      break;
    case 'config':
      // eslint-disable-next-line no-case-declarations
      const configDefenitions = [
        { name: 'nginx-port', type: Number },
        { name: 'arango-port', type: Number },
        { name: 'ton-node-port', type: Number },
        { name: 'q-server-port', type: Number },
        { name: 'ton-node-requests-port', type: Number },
        { name: 'tonos-se-version', type: String },
        { name: 'github-binaries-repository', type: String },
      ];

      // show current config
      // eslint-disable-next-line no-case-declarations
      const config = commandLineArgs(configDefenitions, { argv });
      if (Object.keys(config).length === 0) {
        process.stdout.write(cj(control.config.get()));
        process.stdout.write('\n');
      } else {
        control.config.set(config);
      }
      break;
    case 'version':
      // eslint-disable-next-line no-case-declarations
      const version = await control.version();
      process.stdout.write(cj(version));
      process.stdout.write('\n');
      break;
    default:
      console.log(`Unknown command. Use command '${global.appName} help' to list available commands`);
      break;
  }
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
)();
