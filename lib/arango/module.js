const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const config = require('./config').getConfig();
const control = require('../control');

function runMigations() {
  fs.readdirSync(config.migrationsPath).forEach((file) => {
    exec(`${config.binPathClient} -c none --server.authentication false --javascript.startup-directory ${path.join(config.appPath, 'usr', 'share', 'arangodb3', 'js')} --server.endpoint=${process.env.ARANGO_ENDPOINT} --javascript.execute "${path.join(config.migrationsPath, file)}"`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`Run migrations: ${stdout}`);
    });
  });
}

function start() {
  if (!fs.existsSync(config.pidFilePath)) {
    console.log('Starting arango...');
    control.runApp(
      config.binPath,
      config.paramsStart,
      config.workingDir,
      config.pidFilePath,
    );

    setTimeout(runMigations, 3000);
  } else {
    console.warn('Arango already started!');
  }
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
