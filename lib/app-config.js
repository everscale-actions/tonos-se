const fs = require('fs');
const path = require('path');
const override = require('json-override');

function getConfig() {
  if (!fs.existsSync(global.settingsFilePath)) {
    fs.mkdirSync(global.dataPath, { recursive: true });
    fs.copyFileSync(path.join(global.appRoot, 'settings.template.json'), global.settingsFilePath);
  }

  return JSON.parse(fs.readFileSync(global.settingsFilePath));
}

function setConfig(newSettings) {
  const result = override(JSON.parse(getConfig()), newSettings, true);
  fs.writeFileSync(global.settingsFilePath, JSON.stringify(result));
  console.log('Saving parameters is successful. Please restart ton-node using commands \'ton-node stop\' and \'ton-node start\'');
}

module.exports.getConfig = getConfig;
module.exports.setConfig = setConfig;
