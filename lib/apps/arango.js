/* eslint-disable max-len */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const arangoClient = require('arangojs');
const { retry } = require('@lifeomic/attempt');
const appBase = require('../app-base');
const config = require('./arango-config');
const transform = require('../transform');

function runMigations() {
  process.stdout.write('Applying arango migrations..\n');
  fs.readdirSync(config.migrationsPath).forEach((file) => {
    process.stdout.write(`  - ${file}.. `);
    const params = config.paramsMigrations;
    params.push(`"${path.join(config.migrationsPath, file)}"`);
    execSync(`${config.binPathClient} ${params.join(' ')}`);
    process.stdout.write('Done\n');
  });
  process.stdout.write('Applying arango migrations.. Done\n');
}

function transformPort() {
  const portNumber = config.port;

  const targets = [{
    files: global.envFilePath,
    from: /Q_DATA_MUT=http:\/\/127\.0\.0\.1:\d+/g,
    to: `Q_DATA_MUT=http://127.0.0.1:${portNumber}`,
  },
  {
    files: global.envFilePath,
    from: /Q_DATA_HOT=http:\/\/127\.0\.0\.1:\d+/g,
    to: `Q_DATA_HOT=http://127.0.0.1:${portNumber}`,
  },
  {
    files: global.envFilePath,
    from: /Q_SLOW_QUERIES_MUT=http:\/\/127\.0\.0\.1:\d+/g,
    to: `Q_SLOW_QUERIES_MUT=http://127.0.0.1:${portNumber}`,
  },
  {
    files: global.envFilePath,
    from: /Q_SLOW_QUERIES_HOT=http:\/\/127\.0\.0\.1:\d+/g,
    to: `Q_SLOW_QUERIES_HOT=http://127.0.0.1:${portNumber}`,
  },
  {
    files: global.envFilePath,
    from: /ARANGO_ENDPOINT=tcp:\/\/127\.0\.0\.1:\d+/g,
    to: `ARANGO_ENDPOINT=tcp://127.0.0.1:${portNumber}`,
  },
  {
    files: path.join(global.dataPath, 'ton-node', 'cfg'),
    from: /"server": "127\.0\.0\.1:\d+",/g,
    to: `"server": "127.0.0.1:${portNumber}",`,
  },
  {
    files: path.join(global.appsPath, 'ton-node', 'cfg'),
    from: /"server": "127\.0\.0\.1:\d+",/g,
    to: `"server": "127.0.0.1:${portNumber}",`,
  },
  ];

  transform(targets);
}

async function start() {
  await appBase.start(config);

  //
  await retry(() => {
    const db = new arangoClient.Database({ url: process.env.ARANGO_ENDPOINT }); // todo: need a custom port
    return db.version();
  }, {
    minDelay: 100,
    delay: 200,
    factor: 2,
    maxAttempts: 10,
    maxDelay: 1000,
  });
  runMigations();
}

module.exports.start = start;
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.config = config;
module.exports.prepare = transformPort;
