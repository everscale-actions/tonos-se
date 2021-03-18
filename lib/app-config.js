const fs = require('fs');
const override = require('json-override');
const { appsPool } = require('../server-modules/appsPool');

function getConfig() {
  return fs.readFileSync(global.settingsFilePath);
}

function setConfig(newSettings) {
  const result = override(JSON.parse(getConfig()), newSettings, true);
  fs.writeFileSync(global.settingsFilePath, JSON.stringify(result));
  appsPool.map((app) => app.setPort());
  console.log('Saving parameters is successful. Please restart ton-node using commands \'ton-node stop\' and \'ton-node start\'');
}

module.exports.getConfig = getConfig;
module.exports.setConfig = setConfig;
