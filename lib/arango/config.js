const path = require('path');
const dir = path.join(appRoot, ".server", "arango");
const os = require('os')

exports.getConfig = () => {
    return { 
        "arangoVersion": "3.7.8", //Available versions https://download.arangodb.com/arangodb37/Community/
        "arangoDir": dir,
        "arangoBin": (os.platform() === 'win32' ? path.join(dir, "nginx.exe") : path.join(dir, "nginx")),
        "arangoConf": path.join(dir, "arango.conf"),
        "arangoPidFile":  path.join(dir, "arango.pid"),
        "arangoConfUrl": "https://github.com/tonlabs/tonos-se/blob/master/docker/arango/config"
    }
} 