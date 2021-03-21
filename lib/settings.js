const fs = require('fs');
const path = require('path');
const override = require('json-override');
const settingsDefault = require('./settings-default');

const settingsFilePath = path.join(global.dataPath, 'settings.json');

function get() {
  if (!fs.existsSync(settingsFilePath)) {
    fs.mkdirSync(global.dataPath, { recursive: true });

    fs.writeFileSync(settingsFilePath, JSON.stringify(settingsDefault, null, 2));
  }

  return JSON.parse(fs.readFileSync(settingsFilePath));
}

function set(newSettings) {
  const result = override(get(), newSettings, true);
  fs.writeFileSync(settingsFilePath, JSON.stringify(result, null, 2));
  console.log(`Saving parameters is successful. Use command '${global.appName} restart' for applying changes`);
}

module.exports.get = get;
module.exports.set = set;
