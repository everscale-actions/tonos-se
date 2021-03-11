const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const decompress = require('decompress');
const moduleConfig = require('./config').getConfig();
const downloader = require('./downloader');
const serviceControl = require('../nginx/serviceControl');

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
	const process = require('process')
	
	if(!fs.existsSync(workDir)) {fs.mkdirSync(workDir)}
	const proc = await spawn(binPath, binParams, {cwd: workDir, detached: true, stdio: ['ignore', 'ignore', process.stderr]});

	console.log(`PID of ${path.basename(binPath)}: ${proc.pid}`)
	await proc.unref()

	return proc.pid;
}

async function start(){
	await install(); //create structure and download files if needed
	await require("../nginx/serviceControl").start();
	await require("../arango/serviceControl").start();
}
async function stop(){
	await install(); //create structure and download files if needed
	await require("../nginx/serviceControl").stop();
	await require("../arango/serviceControl").stop();
}

module.exports.runApp = runApp;
module.exports.start = start;
module.exports.stop = stop;
