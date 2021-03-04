const { NginxBinary: NginxBinary } = require("nginx-binaries");
const path = require('path');
const downloader = require('../common/downloader')
const moduleConfig = require("./config").getConfig();

exports.install = async function() {
    const availableNginxBin = await NginxBinary.versions({ version: '^1.19.0' })
    console.log(`Available Nginx Versions: ${availableNginxBin}`);

    const lastNginxBin = availableNginxBin[0];
    console.log(`Last Nginx Version: ${lastNginxBin}`);

    const pathToNginxBin = await NginxBinary.download({ version: lastNginxBin} , moduleConfig.nginxBin );

    await downloader.getConfigFile(moduleConfig.nginxConf , "https://raw.githubusercontent.com/tonlabs/tonos-se/master/docker/nginx.conf.d")
    
    return pathToNginxBin;
};