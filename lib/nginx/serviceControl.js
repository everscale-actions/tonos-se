const moduleConfig = require("../serverManagement/config").getConfig();
const childProcess = require('child_process');
const downloader = require('../serverManagement/downloader')
const fs = require('fs');

async function start() {
    if (!fs.existsSync(moduleConfig.nginxPidFile)) {
        console.log ("Starting nginx");
        execCommand(["-c", moduleConfig.nginxConf ]);
        console.log("Nginx is ready: http://localhost/graphql");
    } else {
        console.warn('Nginx already started!');
    }
};

async function stop() {
    if (fs.existsSync(moduleConfig.nginxPidFile)) {
        console.log("Stopping Nginx")
        execCommand(["-c", moduleConfig.nginxConf, "-s", "stop"]);
    } else {
        console.warn("Nginx is not started!");
    }
};

module.exports.stop = stop;
module.exports.start = start;

