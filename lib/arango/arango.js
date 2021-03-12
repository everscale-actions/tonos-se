const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");
const moduleConfig = require('./config').getConfig();
const serverManagement = require('../serverManagement/management');

async function start() {
  if (!fs.existsSync(moduleConfig.pidFilePath)) {
    console.log('Starting arango...');
    await serverManagement.runApp(
      moduleConfig.binPath,
      moduleConfig.paramsStart,
      moduleConfig.workingDir,
      moduleConfig.pidFilePath,
    );

    function runMigations() {
        fs.readdirSync(moduleConfig.migrationsPath).forEach((file) => {
            exec(`${moduleConfig.binPathClient} -c none --server.authentication false --javascript.startup-directory ${path.join(moduleConfig.appPath, 'usr', 'share', 'arangodb3', 'js')} --server.endpoint=${process.env.ARANGO_ENDPOINT} --javascript.execute "${path.join(moduleConfig.migrationsPath, file)}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        });
    }
    
    setTimeout(runMigations, 3000);

   
  } else {
    console.warn('Arango already started!');
  }
}

async function stop() {
  if (fs.existsSync(moduleConfig.pidFilePath)) {
    console.log('Stopping arango...');
    await process.kill(fs.readFileSync(moduleConfig.pidFilePath));
    if (fs.existsSync(moduleConfig.pidFilePath)) { fs.rmSync(moduleConfig.pidFilePath); }
  } else {
    console.warn('Arango is not started!');
  }
}

module.exports.stop = stop;
module.exports.start = start;
