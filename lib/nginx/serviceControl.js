const moduleConfig = require("./config").getConfig();
const serverManagement = require("../serverManagement/management")
const path = require("path")

const fs = require('fs');

async function start() {
    if (!fs.existsSync(moduleConfig.pidFilePath)) {
        console.log ("Starting nginx");
        console.log(moduleConfig.paramsStart)
        await serverManagement.runService(moduleConfig.binPath, moduleConfig.binParamsStart, path.dirname(moduleConfig.binPath), moduleConfig.workingDir)
    } else {
        console.warn('Nginx already started!');
    }
};

async function stop() {
    if (fs.existsSync(moduleConfig.pidFilePath)) {
        console.log("Stopping Nginx")
        await serverManagement.runService(moduleConfig.binPath, moduleConfig.binParamsStop, path.dirname(moduleConfig.binPath), moduleConfig.workingDir)
    } else {
        console.warn("Nginx is not started!");
    }
};

module.exports.stop = stop;
module.exports.start = start;

