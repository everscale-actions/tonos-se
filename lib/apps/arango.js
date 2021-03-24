/* eslint-disable max-len */
const fs = require('fs');
const path = require('path');
const { execFile, execSync } = require('child_process');
const arangoClient = require('arangojs');
const { retry } = require('@lifeomic/attempt');
const appBase = require('../app-base');
const config = require('./arango-config');

function runMigations() {
  process.stdout.write('  Checking arango migrations..\n');
  fs.readdirSync(config.migrationsPath).forEach((file) => {
    process.stdout.write(`  - ${file}.. `);
    const params = config.paramsMigrations;
    params.push(`"${path.join(config.migrationsPath, file)}"`);
    execSync(`${config.binPathClient} ${params.join(' ')}`, { env: config.env });
    process.stdout.write('Done\n');
  });
}

async function start() {
  await appBase.start(config);

  //
  await retry(() => {
    const db = new arangoClient.Database({ url: `tcp://localhost:${global.arangoPort}` }); // todo: need a custom port
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

async function getVersion() {
  return new Promise((resolve, reject) => {
    execFile(config.binPath, ['--version'], (error, stdout) => {
      if (error) {
        reject(error);
      }
      const version = stdout.split('\r\n').find((s) => s.startsWith('full-version-string:')).split(':')[1].trim();
      resolve({ app: config.serviceName, version });
    });
  });
}

module.exports.start = start;
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.version = getVersion;
