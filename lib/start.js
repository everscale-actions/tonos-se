serverDir = ".server";

exports.exec = function() {
    require("./install").install();

    nginxStart();

    console.log('Now you can open http://localhost')
};

function nginxStart() {
    const childProcess = require('child_process'),
        path = require('path'),
        fs = require('fs-extra');

    if (!fs.existsSync(path.join(serverDir, 'nginx', 'logs', 'nginx.pid'))) {
        nginx = childProcess.spawn('nginx', { detached: true, stdio: 'ignore', cwd: path.join(serverDir, 'nginx') });
        nginx.unref();
    } else {
        console.warn('Nginx already started!');
    }
}