const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { config } = require('./config');
const appBase = require('../app-base');

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
  setTimeout(runMigations, 3000);
}

module.exports.start = start;
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
