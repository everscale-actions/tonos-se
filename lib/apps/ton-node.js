const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { execFile } = require('child_process');
const config = require('./ton-node-config');
const app = require('../app-base')(config);
const appBaseStart = require('../app-base-start');

function transformMainConfig() {
  const appCfgPath = path.join(config.appPath, 'ton-node.conf.json');
  const dataCfgPath = path.join(config.dataPath, 'ton-node.conf.json');
  const cfg = JSON.parse(fs.readFileSync(appCfgPath, 'utf8'));

  cfg.port = global.nodeSePort;
  cfg.private_key = path.join(config.appPath, 'private-key');
  cfg.keys = [path.join(config.appPath, 'pub-key')];
  cfg.document_db.server = `127.0.0.1:${global.arangoPort}`;
  cfg.kafka_msg_recv.port = global.nodeSeRequestsPort;

  fs.writeFileSync(dataCfgPath, JSON.stringify(cfg, null, 2));

  // copy blockchain.conf.json
  fs.copyFileSync(path.join(config.appPath, 'blockchain.conf.json'), path.join(config.dataPath, 'blockchain.conf.json'));
}

function transformLogConfig() {
  const appCfgPath = path.join(config.appPath, 'log_cfg.yml');
  const dataCfgPath = path.join(config.dataPath, 'log_cfg.yml');
  const cfg = YAML.parse(fs.readFileSync(appCfgPath, 'utf8'));

  cfg.appenders.logfile.path = path.join(config.logsPath, 'output.log');

  fs.writeFileSync(dataCfgPath, YAML.stringify(cfg, null, 2));
}

app.start = async () => {
  transformMainConfig();
  transformLogConfig();

  await appBaseStart(config);
};

app.version = async () => new Promise((resolve, reject) => {
  execFile(config.binPath, ['--version'], (error, stdout) => {
    if (error) {
      reject(error);
    }
    const version = stdout.split('\n')[0].trim();
    resolve({ app: config.serviceName, version });
  });
});

module.exports = app;
