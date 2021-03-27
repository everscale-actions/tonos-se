const path = require('path');
const fs = require('fs');
const resolve = require('resolve-dir');
const { bin: packageJsonBin } = require('../package.json');

global.appRoot = resolve('~/.tonos-se');

[global.appName] = Object.keys(packageJsonBin);
global.cachePath = path.join(global.appRoot, '.cache');
global.appsPath = path.join(global.appRoot, 'apps');
global.dataPath = path.join(global.appRoot, 'data');
global.logsPath = path.join(global.appRoot, 'logs');
global.procPath = path.join(global.appRoot, 'proc');

fs.mkdirSync(global.appRoot, { recursive: true });
fs.mkdirSync(global.cachePath, { recursive: true });

const config = require('./tonos-se-config').get();

global.nginxPort = parseInt(process.env.TONOS_SE_NGINX_PORT, 10) || config['nginx-port'];
global.qServerPort = parseInt(process.env.TONOS_SE_Q_PORT, 10) || config['q-server-port'];
global.nodeSePort = parseInt(process.env.TONOS_SE_NODESE_PORT, 10) || config['ton-node-port'];
global.nodeSeRequestsPort = parseInt(process.env.TONOS_SE_NODESE_KAFKA_MSG_PORT, 10) || config['ton-node-kafka-msg-port'];
global.nodeSeAdnlPort = parseInt(process.env.TONOS_SE_NODESE_ADNL_PORT, 10) || config['ton-node-adnl-port'];
global.arangoPort = parseInt(process.env.TONOS_SE_ARANGO_PORT, 10) || config['arango-port'];
global.nodeSeReleaseTag = process.env.TONOS_RELEASE_TAG || config['tonos-se-version'];
global.githubBinariesRepository = process.env.GITHUB_BINARIES_REPOSITORY || config['github-binaries-repository'];
