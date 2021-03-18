const fs = require('fs');
const override = require('json-override');
const settingsDefault = require('./settings-default');

function getConfig() {
  if (!fs.existsSync(global.settingsFilePath)) {
    fs.mkdirSync(global.dataPath, { recursive: true });

    fs.writeFileSync(global.settingsFilePath, JSON.stringify(settingsDefault, null, 2));
  }

  return JSON.parse(fs.readFileSync(global.settingsFilePath));
}

function setConfig(newSettings) {
  const result = override(getConfig(), newSettings, true);
  fs.writeFileSync(global.settingsFilePath, JSON.stringify(result, null, 2));
  console.log('Saving parameters is successful. Use command \'ton-node restart\' for applying changes');
}

module.exports.getConfig = getConfig;
module.exports.setConfig = setConfig;
