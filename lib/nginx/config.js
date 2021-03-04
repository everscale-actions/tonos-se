const path = require('path');
const dir = path.join(appRoot, ".server", "nginx");
const os = require('os')

exports.getConfig = () => {
    return { 
        "nginxVersion": "^1.19.0",
        "nginxDir": dir,
        "nginxBin": (os.platform() === 'win32' ? path.join(dir, "nginx.exe") : path.join(dir, "nginx")),
        "nginxConf": path.join(dir, "nginx.conf"),
        "nginxPidFile":  path.join(dir, "nginx.pid"),
        "nginxConfUrl": "https://raw.githubusercontent.com/tonlabs/tonos-se/master/docker/nginx.conf.d"
    }
} 