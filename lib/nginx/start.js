const moduleConfig = require("./config").getConfig();

exports.exec = async function() {
    await require("./install").install();
    nginxStart();
    console.log('Now you can open http://localhost');
};

function nginxStart() {
    const childProcess = require('child_process'),
        path = require('path'),
        fs = require('fs-extra');

    if (!fs.existsSync(path.join(moduleConfig.nginxDir, 'nginx.pid'))) {
        console.log ("Starting nginx");
        nginx = childProcess.spawnSync( moduleConfig.nginxBin , ["-c", `${moduleConfig.nginxConf}`] , { detached: true, stdio: 'ignore', cwd: moduleConfig.nginxDir});
        console.log(nginx)
    } else {
        console.warn('Nginx already started!');
    }
}