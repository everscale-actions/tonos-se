const path = require('path');
const os = require('os')
const { NginxBinary: nginxBinary } = require("nginx-binaries");
const dir = 'nginx';

const nginxBin = os.platform() === 'win32' ? path.join(dir, "nginx.exe") : path.join(dir, "nginx");
nginxBinary.download({ version: process.env.NGINX_VERSION}, nginxBin );