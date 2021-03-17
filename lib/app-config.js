const fs = require('fs');
const appSettingsPath = require('./appSettings.json');

function getConfig() {
  if (fs.existsSync(appSettingsPath)) {
    process.stdout.write(JSON.stringify(fs.readFileSync(appSettingsPath)));
  } else {
    process.stdout.write('appSettings file not found!\n');
  }
}

module.exports = getConfig;
