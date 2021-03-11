const fs = require('fs');
const moduleConfig = require('./config').getConfig();
const serverManagement = require('../serverManagement/management');

async function start() {
  if (!fs.existsSync(moduleConfig.pidFilePath)) {
    console.log('Starting nginx');
    await serverManagement.runApp(
      moduleConfig.binPath, moduleConfig.paramsStart, moduleConfig.workingDir,
    );
  } else {
    console.warn('Nginx already started!');
  }
}

async function stop() {
  if (fs.existsSync(moduleConfig.pidFilePath)) {
    console.log('Stopping Nginx');
    await serverManagement.runApp(moduleConfig.binPath,
      moduleConfig.paramsStop,
      moduleConfig.workingDir);
  } else {
    console.warn('Nginx is not started!');
  }
}

module.exports.stop = stop;
module.exports.start = start;
