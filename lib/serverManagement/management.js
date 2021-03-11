const childProcess = require('child_process');
const moduleConfig = require("./config").getConfig();
const downloader = require('./downloader')
const path = require('path')
const fs = require('fs')
const decompress = require('decompress')

async function install() {
	try{
		const releaseFilePath = path.join(cachePath, path.basename(moduleConfig.releaseUrl))

		if(!fs.existsSync(dataPath)) { fs.mkdirSync(dataPath) }
		if(!fs.existsSync(logsPath)) { fs.mkdirSync(logsPath) }

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

async function runService(binPath, binParams, cwd, workDir){
	console.log(binPath);
	if(!fs.existsSync(workDir)) { console.log(`Creating working directory: ${workDir}`); fs.mkdirSync(workDir); }
    const pr = childProcess.spawn( binPath, binParams, { cwd: cwd, detached: true, stdio: 'ignore' });
    pr.unref();
    //pr.unref();
}

async function start(){
	await install(); //create structure and download files if needed
	await require("../nginx/serviceControl").start();
}
async function stop(){
	await install(); //create structure and download files if needed
	await require("../nginx/serviceControl").stop();
}

module.exports.runService = runService;
module.exports.start = start;
module.exports.stop = stop;

