const fs = require('fs');
const path = require('path');
const override = require('json-override');
const configDefault = require('./tonos-se-config-default');

const configFilePath = path.join(global.appRoot, 'config.json');

function get() {
  if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, JSON.stringify(configDefault, null, 2));
  }

  const config = JSON.parse(fs.readFileSync(configFilePath));
  return override(configDefault, config, true);
}

function set(config) {
  const result = override(get(), config, true);
  fs.writeFileSync(configFilePath, JSON.stringify(result, null, 2));
  process.stdout.write(`Saving parameters is successful. Use command '${global.appName} restart' for applying changes\n`);
}

async function reset() {
  return new Promise((resolve) => fs.rm(configFilePath, resolve));
}

module.exports.get = get;
module.exports.set = set;
module.exports.reset = reset;
