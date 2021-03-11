const path = require('path');
const os = require('os')

exports.getConfig = () => {
    return { 
        "appPath": path.join(appsPath, "nginx"),
        "binPath": path.join(appsPath, "nginx" , "nginx") + (os.platform() === 'win32' ? ".exe" : ""),
        "pidFilePath": path.join(dataPath, "nginx.pid"),
    }
} 