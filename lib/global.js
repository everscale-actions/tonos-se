const path = require('path');
const fs = require('fs');

global.appRoot = path.join(path.resolve(__dirname), '..');

const packageJson = JSON.parse(fs.readFileSync(path.join(global.appRoot, 'package.json'), 'utf8'));

// eslint-disable-next-line prefer-destructuring
global.appName = Object.keys(packageJson.bin)[0];
global.cliVersion = packageJson.version;
global.binariesVersion = global.cliVersion.match(/(?<major>\d+).\d+.\d+/).groups.major;
global.serverPath = path.join(global.appRoot, '.server');
global.appsPath = path.join(global.serverPath, 'apps');
global.dataPath = path.join(global.serverPath, 'data');
global.logsPath = path.join(global.serverPath, 'logs');
global.cachePath = path.join(global.appRoot, '.cache');

const settings = require('./settings').get();

global.nginxPort = process.env.TONOS_SE_NGINX_PORT ?? settings['nginx-port'];
global.qServerPort = process.env.TONOS_SE_Q_PORT ?? settings['q-server-port'];
global.nodeSePort = process.env.TONOS_SE_NODESE_PORT ?? settings['ton-node-port'];
global.nodeSeRequestsPort = process.env.TONOS_SE_NODESE_REQUESTS_PORT ?? settings['ton-node-requests-port'];
global.arangoPort = process.env.TONOS_SE_ARANGO_PORT ?? settings['arango-port'];
global.nodeSeReleaseTag = process.env.TONOS_RELEASE_TAG ?? settings['node-release'];
global.githubBinariesRepository = process.env.GITHUB_BINARIES_REPOSITORY ?? settings['github-binaries-repository'];
