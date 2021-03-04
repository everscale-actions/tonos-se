exports.exec = function() {
    nginxStop();
};

function nginxStop() {
    const childProcess = require('child_process'),
        path = require('path'),
        fs = require('fs-extra');

    if (fs.existsSync(path.join('.server', 'nginx', 'logs', 'nginx.pid'))) {
        childProcess.execSync(path.join('nginx -s stop'), { cwd: path.join('.server', 'nginx') });
    } else {
        console.warn('Nginx is not started!');
    }
}