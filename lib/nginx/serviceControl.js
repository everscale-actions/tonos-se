const moduleConfig = require("./config").getConfig();
const childProcess = require('child_process');
const downloader = require('../common/downloader')
const fs = require('fs');
const { NginxBinary: NginxBinary } = require("nginx-binaries");

async function install() {
    const availableNginxBin = await NginxBinary.versions({ version: moduleConfig.nginxVersion })
    const lastNginxBin = availableNginxBin[0];
    console.log(`Last Nginx Version: ${lastNginxBin}`);

    await NginxBinary.download({ version: lastNginxBin} , moduleConfig.nginxBin );
    await downloader.getConfigFile(moduleConfig.nginxConf , moduleConfig.nginxConfUrl)
    return moduleConfig.nginxBin;
};

async function start() {
    await require("./serviceControl").install();
    nginxStart();
};

async function stop() {
    await require("./serviceControl").install();
    nginxStop();
};

function execCommand(params){
    const pr = childProcess.spawn( moduleConfig.nginxBin, params, { cwd: moduleConfig.nginxDir, detached: true, stdio: 'ignore' });
    pr.unref();

}

async function nginxStop(){
    if (fs.existsSync(moduleConfig.nginxPidFile)) {
        console.log("Stopping Nginx")
        execCommand(["-c", moduleConfig.nginxConf, "-s", "stop"]);
    } else {
        console.warn("Nginx is not started!");
    }
};

async function nginxStart() {
    if (!fs.existsSync(moduleConfig.nginxPidFile)) {
        console.log ("Starting nginx");
        execCommand(["-c", moduleConfig.nginxConf ]);
        console.log("Nginx is ready: http://localhost/graphql");
    } else {
        console.warn('Nginx already started!');
    }
}

module.exports.stop = stop;
module.exports.start = start;
module.exports.install = install;

