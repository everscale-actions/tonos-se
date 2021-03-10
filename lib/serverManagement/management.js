const childProcess = require('child_process');

function runService(binPath, params, workDir){
    const pr = childProcess.spawn( binPath, params, { cwd: workDir, detached: true, stdio: 'ignore' });
    pr.unref();
}

module.exports.runService = runService;

