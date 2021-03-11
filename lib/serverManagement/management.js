const childProcess = require('child_process');
var spawn = require('child_process').spawn;
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

async function runApp(binPath, binParams, workDir){
	if(!fs.existsSync(workDir)) {fs.mkdirSync(workDir)}
	const process = spawn(binPath, binParams, {cwd: workDir, detached: true, stdio: 'ignore'});

	process.on('error', (err) =>
		logger.error(`Nginx received error: ${err.message}`)
	);

	process.unref()
}

async function start(){
	await install(); //create structure and download files if needed
	await require("../nginx/serviceControl").start();
}
async function stop(){
	await install(); //create structure and download files if needed
	await require("../nginx/serviceControl").stop();
}

module.exports.runApp = runApp;
module.exports.start = start;
module.exports.stop = stop;

