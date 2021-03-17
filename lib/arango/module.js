const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const arangoClient = require('arangojs');
const { retry } = require('@lifeomic/attempt');
const appBase = require('../app-base');

const { config } = require('./config');

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

async function start() {
  await appBase.start(config);
  //
  await retry(() => {
    const db = new arangoClient.Database();
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
