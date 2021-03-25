const path = require('path');
const fs = require('fs');

global.appRoot = path.join(path.resolve(__dirname), '..');

const packageJson = JSON.parse(fs.readFileSync(path.join(global.appRoot, 'package.json'), 'utf8'));

// eslint-disable-next-line prefer-destructuring
global.appName = Object.keys(packageJson.bin)[0];
global.cliVersion = packageJson.version;
global.binariesVersion = global.cliVersion.match(/(?<major>\d+).\d+.\d+/).groups.major;
global.serverPath = path.join(global.appRoot, '.server');
global.cachePath = path.join(global.appRoot, '.cache');
global.appsPath = path.join(global.serverPath, 'apps');
global.dataPath = path.join(global.serverPath, 'data');
global.logsPath = path.join(global.serverPath, 'logs');
global.procPath = path.join(global.serverPath, 'proc');

fs.mkdirSync(global.serverPath, { recursive: true });
fs.mkdirSync(global.cachePath, { recursive: true });

const config = require('./tonos-se-config').get();

global.nginxPort = process.env.TONOS_SE_NGINX_PORT ?? config['nginx-port'];
global.qServerPort = process.env.TONOS_SE_Q_PORT ?? config['q-server-port'];
global.nodeSePort = process.env.TONOS_SE_NODESE_PORT ?? config['ton-node-port'];
global.nodeSeRequestsPort = process.env.TONOS_SE_NODESE_REQUESTS_PORT ?? config['ton-node-requests-port'];
global.arangoPort = process.env.TONOS_SE_ARANGO_PORT ?? config['arango-port'];
global.nodeSeReleaseTag = process.env.TONOS_RELEASE_TAG ?? config['tonos-se-version'];
global.githubBinariesRepository = process.env.GITHUB_BINARIES_REPOSITORY ?? config['github-binaries-repository'];
