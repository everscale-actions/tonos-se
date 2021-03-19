const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const config = require('./ton-node-config');
const appBase = require('../app-base');

function transformConfig() {
  const appCfgPath = path.join(config.appPath, 'cfg');
  const dataCfgPath = path.join(config.dataPath, 'cfg.json');
  const cfg = JSON.parse(fs.readFileSync(appCfgPath, 'utf8'));

  cfg.port = global.nodeSePort;
  cfg.private_key = path.join(config.appPath, 'private-key');
  cfg.keys = [path.join(config.appPath, 'pub-key')];
  cfg.document_db.server = `127.0.0.1:${global.arangoPort}`;
  cfg.kafka_msg_recv.port = global.nodeSeRequestsPort

  fs.writeFileSync(dataCfgPath, JSON.stringify(cfg, null, 2));
}

function transformLogYaml() {
  const appCfgPath = path.join(config.appPath, 'log_cfg.yml');
  const dataCfgPath = path.join(config.dataPath, 'log_cfg.yml');
  const cfg = YAML.parse(fs.readFileSync(appCfgPath, 'utf8'));

  cfg.appenders.logfile.path = path.join(config.logsPath, 'output.log');

  fs.writeFileSync(dataCfgPath, YAML.stringify(cfg, null, 2));
}

function prepare() {
  if (!fs.existsSync(config.dataPath)) { fs.mkdirSync(config.dataPath, { recursive: true }); }
  transformConfig();
  transformLogYaml();
}

module.exports.start = () => appBase.start(config);
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.prepare = prepare;
