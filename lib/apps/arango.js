const fs = require('fs');
const path = require('path');
const { execFile, execSync } = require('child_process');
const arangoClient = require('arangojs');
const { retry } = require('@lifeomic/attempt');
const config = require('./arango-config');
const app = require('../app-base')(config);
const appBaseStart = require('../app-base-start');

function checkMigations() {
  process.stdout.write('  Checking arango migrations..\n');
  fs.readdirSync(config.migrationsPath).forEach((file) => {
    process.stdout.write(`  - ${file}.. `);
    const params = config.paramsMigrations;
    params.push(`"${path.join(config.migrationsPath, file)}"`);
    execSync(`${config.binPathClient} ${params.join(' ')}`, { env: config.env });
    process.stdout.write('Done\n');
  });
}

app.start = async () => {
  // start arango server
  await appBaseStart(config);

  // wait for arango db
  await retry(() => {
    const db = new arangoClient.Database({ url: `tcp://localhost:${global.arangoPort}` });
    return db.version();
  }, { delay: 500, maxAttempts: 60 });

  // apply migrations
  checkMigations();
};

app.version = async () => new Promise((resolve, reject) => {
  execFile(config.binPath, ['--version'], (error, stdout) => {
    if (error) {
      reject(error);
    }
    const version = stdout.split('\n').find((s) => s.startsWith('full-version-string:')).split(':')[1].trim();
    resolve({ app: config.serviceName, version });
  });
});

module.exports = app;
