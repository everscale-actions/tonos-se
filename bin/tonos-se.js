#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const control = require('../lib/tonos-se');
const PortsAlreadyInUseError = require('../lib/errors/ports-already-in-use');

/* first - parse the main command */
const mainDefinitions = [
  { name: 'command', defaultOption: true },
  { name: 'help', alias: 'h', type: Boolean },
];
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
// eslint-disable-next-line no-underscore-dangle
const argv = mainOptions._unknown || [];

async function main() {
  if (mainOptions.help === true) {
    mainOptions.command = 'help';
  }
  switch (mainOptions.command) {
    case 'help':

      // eslint-disable-next-line no-case-declarations
      const sections = [
        {
          header: 'TONOS SE CLI',
          content: 'Easy install, configure and manage TON OS Startup Edition components without Docker.',
        },
        {
          header: 'Synopsis',
          content: `$ ${global.appName} <command> <options>`,
        },
        {
          header: 'Command List',
          content: [
            { name: 'help', summary: 'Display help information.' },
            { name: 'start | stop | restart', summary: 'Start, stop or restart necessary services.' },
            { name: 'config', summary: 'Show and configure listening ports and other options. Follow \'config options\' in this help section to get details.' },
            { name: 'reset', summary: 'Soft remove internal applications without touching data files. Use --hard option for removing whole applications and data files.' },
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
            { name: '--node-release', summary: 'Set a version of applications pack' },
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
          process.stderr.write('Please change service port using command \'config <paramters>\'. To get more details use \'tonos-se --help\'\n');
          return;
        }
        throw ex;
      }
      process.stdout.write('================================\n');
      process.stdout.write(`GraphQL: http://localhost:${global.nginxPort}/graphql\n`);
      process.stdout.write(`ArangoDB: http://localhost:${global.arangoPort}\n`);
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
        const statusText = s.isRunning ? `running. Pid: ${s.pid}` : 'stopped';
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
        { name: 'node-release', type: String },
        { name: 'github-binaries-repository', type: String },
      ];

      // show current config
      // eslint-disable-next-line no-case-declarations
      const newSettings = commandLineArgs(configDefenitions, { argv });
      if (Object.keys(newSettings).length === 0) {
        console.log(control.config.get());
      } else {
        control.config.set(newSettings);
      }

      break;
    default:
      console.log(`Unknown command. Use command '${global.appName} --help' to list available commands`);
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
