const fs = require('fs');
const path = require('path');
const override = require('json-override');

const appSettingsPath = path.join(__dirname, './appSettings.json');

function getConfig() {
  return JSON.parse(fs.readFileSync(appSettingsPath));
}

function setConfig(newSettings) {
  const result = override(getConfig(), newSettings, true);
  fs.writeFileSync(appSettingsPath, result);

  // TODO change files

  console.log('Saving parameters is successful. Please restart ton-node using commands \'ton-node stop\' and \'ton-node start\'');
}

module.exports.getConfig = getConfig;
module.exports.setConfig = setConfig;
