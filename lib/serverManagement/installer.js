const moduleConfig = require("./config").getConfig();
const downloader = require('./downloader')
const path = require('path')
const fs = require('fs')
const decompress = require('decompress')

async function install() {
	try{
		const releaseFilePath = path.join(cachePath, path.basename(moduleConfig.releaseUrl))

		if (!fs.existsSync(releaseFilePath)) { 
			console.log(`Downloading ${moduleConfig.releaseUrl}`)
			await downloader.getBinaryFile(moduleConfig.releaseUrl, cachePath) 
		}
		
		if(!fs.existsSync(appsPath)) {
			console.log(`Decompressing ${releaseFilePath}`)
			await decompress(releaseFilePath, appsPath)
		}
	} catch (err) {
		console.log (err.message)
	}
};

module.exports.install = install;

