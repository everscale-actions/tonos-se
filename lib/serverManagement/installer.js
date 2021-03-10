const moduleConfig = require("./config").getConfig();
const childProcess = require('child_process');
const downloader = require('./downloader')
const path = require('path')
const decompress = require('decompress')

const fs = require('fs');

async function install() {
    if(needInstall()) {
		console.log("Installing Node Se")
		try {
			await downloader.getBinaryFile(moduleConfig.releaseUrl, moduleConfig.cacheDir)
			const releaseFilePath = path.join(moduleConfig.cacheDir, path.basename(moduleConfig.releaseUrl))
        	await decompress(releaseFilePath, moduleConfig.serverDir)
		}
		catch(err){
			console.log(err.message);
		}
	} else {
		console.log("Node Se is already installed")
	}
};

function needInstall() {
    return !fs.existsSync(moduleConfig.rootDir)
};

module.exports.install = install;

