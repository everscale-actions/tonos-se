const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { config } = require('./config');

const { runApp } = require('../run-app');

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

function start() {
  runApp(config);
  setTimeout(runMigations, 3000);
}

function stop() {
  if (fs.existsSync(config.pidFilePath)) {
    console.log('Stopping arango...');
    const pid = fs.readFileSync(config.pidFilePath, 'utf8').trim();
    try {
      process.kill(pid);
    } catch (error) {
      console.log(`Kill process ${pid} failed with error: ${error}`);
    }
    if (fs.existsSync(config.pidFilePath)) { fs.rmSync(config.pidFilePath); }
  } else {
    console.warn('Arango is not started!');
  }
}

module.exports.stop = stop;
module.exports.start = start;
module.exports.config = config;
