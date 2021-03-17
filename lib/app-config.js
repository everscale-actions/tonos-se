const fs = require('fs');
const path = require('path');
const override = require('json-override');

const appSettingsPath = path.join(__dirname, './appSettings.json');

function getConfig() {
  return JSON.parse(fs.readFileSync(appSettingsPath));
}

function setConfig(newSettings) {
  const result = override(getConfig(), newSettings, true);
  console.log(JSON.stringify(result));
}

module.exports.getConfig = getConfig;
module.exports.setConfig = setConfig;
