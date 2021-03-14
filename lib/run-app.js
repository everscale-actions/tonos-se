const fs = require('fs');
const { spawn } = require('child_process');
const { getStatusInternal } = require('./get-status');

function runApp(config) {
  // delete dead pid files
  getStatusInternal(config.pidFilePath);

  if (!fs.existsSync(config.pidFilePath)) {
    process.stdout.write(`Starting ${config.serviceName}.. `);
    if (!fs.existsSync(config.logsPath)) { fs.mkdirSync(config.logsPath, { recursive: true }); }
    if (!fs.existsSync(config.dataPath)) { fs.mkdirSync(config.dataPath, { recursive: true }); }

    const logStream = config.outFile ? fs.openSync(config.outFile, 'w') : 'ignore';
    const errStream = config.errFile ? fs.openSync(config.errFile, 'w') : 'ignore';
    const proc = spawn(config.binPath, config.paramsStart, { cwd: config.dataPath, detached: true, stdio: ['ignore', logStream, errStream] });
    proc.unref();
    if (config.pidFilePath) { fs.writeFileSync(config.pidFilePath, proc.pid.toString()); }
    process.stdout.write('Done \n');
  } else {
    process.stdout.write(`Service ${config.serviceName} already started!\n`);
  }
}

module.exports.runApp = runApp;
