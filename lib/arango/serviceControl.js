const moduleConfig = require("./config").getConfig();
const childProcess = require('child_process');
const downloader = require('../common/downloader')
const fs = require('fs');
const path = require('path')
const unzipper = require('unzipper')

async function install() {
    function linkToDownload(version){
        //https://download.arangodb.com/arangodb37/Community/Windows/ArangoDB3-3.7.8_win64.zip
        //https://download.arangodb.com/arangodb37/Community/Linux/arangodb3-linux-3.7.8.tar.gz
        //https://download.arangodb.com/arangodb37/Community/MacOSX/arangodb3-macos-3.7.8.tar.gz

        const basePath = "https://download.arangodb.com/arangodb37/Community";
        
        switch (require('os').platform()) {
            case 'win32':
                return `${basePath}/Windows/ArangoDB3-${version}_win64.zip` 
            case 'darwin':
                return `${basePath}/MacOSX/arangodb3-macos-${version}.tar.gz` 
            case 'linux':
                return `${basePath}/Linux/arangodb3-linux-${version}.tar.gz`
            default:
              return;
          }
    }

    const link = linkToDownload(moduleConfig.arangoVersion)
    const pathToFile = await downloader.getBinaryFile(moduleConfig.arangoDir , path.basename(link) , link)
    // fs.createReadStream(pathToFile)
    //     .pipe(unzipper.Extract({ path: moduleConfig.arangoDir }));
    console.log("Downloaded")
    return moduleConfig.nginxBin;
};

async function start() {
    await install();
    //arangoStart();
};

async function stop() {
    await install();
    //arangoStop();
};

function execCommand(params){
    const pr = childProcess.spawn( moduleConfig.nginxBin, params, { cwd: moduleConfig.nginxDir, detached: true, stdio: 'ignore' });
    pr.unref();
}

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

