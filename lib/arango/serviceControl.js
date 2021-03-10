const moduleConfig = require("./config").getConfig();
const childProcess = require('child_process');
const downloader = require('../serverManagement/downloader')
const fs = require('fs');
const os = require('os');
const path = require('path')
const unzipper = require('unzipper')
const decompress = require('decompress')

async function start() {
    arangoStart();
};

async function stop() {
    arangoStop();
};



async function arangoStop(){
    if (fs.existsSync(moduleConfig.nginxPidFile)) {
        console.log("Stopping Nginx")
        execCommand(["-c", moduleConfig.nginxConf, "-s", "stop"]);
    } else {
        console.warn("Nginx is not started!");
    }
};

async function arangoStart() {
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

