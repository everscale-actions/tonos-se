const moduleConfig = require("./config").getConfig();
const serverManagement = require("../serverManagement/management")
const fs = require('fs');
const moduleConfig = require('./config').getConfig();

async function start() {
    if (!fs.existsSync(moduleConfig.pidFilePath)) {
        console.log ("Starting arango...");
        await serverManagement.runApp(moduleConfig.binPath,moduleConfig.paramsStart, moduleConfig.workingDir)
        //need init scripts from initdb.d
        // arangosh --server.authentication false \
        //             --server.endpoint=tcp://127.0.0.1:$ARANGO_INIT_PORT \
        //             --javascript.execute "$f"
    } else {
        console.warn('Arango already started!');
    }
};

async function stop() {
    if (fs.existsSync(moduleConfig.pidFilePath)) {
        console.log("Stopping arango...")
        await process.kill(fs.readFileSync(moduleConfig.pidFilePath))
        if(fs.existsSync(moduleConfig.pidFilePath)) {fs.rmSync(moduleConfig.pidFilePath)}

    } else {
        console.warn("Arango is not started!");
    }
};

module.exports.stop = stop;
module.exports.start = start;
