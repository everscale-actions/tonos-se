const fs = require('fs');
const path = require('path');
const override = require('json-override');
const settingsDefault = require('./settings-default');

const settingsFilePath = path.join(global.dataPath, 'settings.json');

function getConfig() {
  if (!fs.existsSync(settingsFilePath)) {
    fs.mkdirSync(global.dataPath, { recursive: true });

    fs.writeFileSync(settingsFilePath, JSON.stringify(settingsDefault, null, 2));
  }

  return JSON.parse(fs.readFileSync(settingsFilePath));
}

function setConfig(newSettings) {
  const result = override(getConfig(), newSettings, true);
  fs.writeFileSync(settingsFilePath, JSON.stringify(result, null, 2));
  console.log('Saving parameters is successful. Use command \'ton-node restart\' for applying changes');
}

module.exports.getConfig = getConfig;
module.exports.setConfig = setConfig;
