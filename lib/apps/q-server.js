const fs = require('fs');
const path = require('path');
const config = require('./q-server-config');
const appBase = require('../app-base');

async function getVersion() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(config.appPath, 'package.json'), (err, data) => {
      if (err) {
        reject(err);
      }
      resolve({
        app: config.serviceName,
        version: JSON.parse(data.toString()).version,
      });
    });
  });
}

module.exports.start = () => appBase.start(config);
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.version = getVersion;
