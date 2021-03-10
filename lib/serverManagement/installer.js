const moduleConfig = require("./config").getConfig();
const childProcess = require('child_process');
const downloader = require('./downloader')
const path = require('path')

const fs = require('fs');

async function install() {
    if(needInstall()) {
		console.log("Installing Node Se")
		await downloader.getBinaryFile(moduleConfig.cacheDir , path.basename(moduleConfig.releaseUrl) , moduleConfig.releaseUrl)
		
	} else {
		console.log("Node Se is already installed")
	}
};

function needInstall() {
    return !fs.existsSync(moduleConfig.rootDir)
};

module.exports.install = install;

