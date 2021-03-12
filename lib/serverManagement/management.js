<<<<<<< HEAD
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const decompress = require('decompress');
const moduleConfig = require('./config').getConfig();
const downloader = require('./downloader');
const serviceControl = require('../nginx/serviceControl');
=======
const childProcess = require('child_process');
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;
const moduleConfig = require("./config").getConfig();
const downloader = require('./downloader')
const path = require('path')
const fs = require('fs')
const decompress = require('decompress')
const process = require('process')
>>>>>>> e8f28ea... arango windows integration

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

async function runApp(binPath, binParams, workDir, pidFilePath){
	
	if(!fs.existsSync(workDir)) {fs.mkdirSync(workDir)}
	const proc = spawn(binPath, binParams, {cwd: workDir, detached: true, stdio: ['ignore', 'ignore', process.stdout]});

	console.log(`${binPath} ${binParams.join(' ')}`)

	process.on('error', (err) => console.error(`${err.message}`));
	await proc.unref()

	if(pidFilePath) { fs.writeFileSync(pidFilePath,proc.pid.toString()) } 

	return proc.pid.toString();
}

async function start(){
	await install(); //create structure and download files if needed
	await require("../nginx/nginx").start();
	await require("../arango/arango").start();
}
async function stop(){
	await install(); //create structure and download files if needed
	await require("../nginx/nginx").stop();
	await require("../arango/arango").stop();
}

module.exports.runApp = runApp;
module.exports.start = start;
module.exports.stop = stop;
