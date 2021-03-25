const fs = require('fs');
const path = require('path');
const config = require('./q-server-config');
const app = require('../app-base')(config);

app.version = async () => new Promise((resolve, reject) => {
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

module.exports = app;
