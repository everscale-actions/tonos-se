const fs = require('fs');
const moduleConfig = require('./config').getConfig();
const serverManagement = require('../serverManagement/management');

function start() {
  if (!fs.existsSync(moduleConfig.pidFilePath)) {
    console.log('Starting nginx');
    serverManagement.runApp(
      moduleConfig.binPath, moduleConfig.paramsStart, moduleConfig.workingDir,
    );
  } else {
    console.warn('Nginx already started!');
  }
}

function stop() {
  if (fs.existsSync(moduleConfig.pidFilePath)) {
    console.log('Stopping Nginx');
    serverManagement.runApp(moduleConfig.binPath,
      moduleConfig.paramsStop,
      moduleConfig.workingDir);
  } else {
    console.warn('Nginx is not started!');
  }
}

module.exports.stop = stop;
module.exports.start = start;
